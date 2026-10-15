# Looks up the pixel dimensions of imgix images at build time so the layout
# can reserve the right space (and galleries know each slide's aspect ratio)
# before anything loads.
#
# Results are cached in .jekyll-cache/media-dimensions.json, so only new
# images hit the network.

require "json"
require "net/http"
require "uri"
require "fileutils"

module MediaDimensions
  CACHE_FILE = File.join(".jekyll-cache", "media-dimensions.json")
  THREADS = 16

  class << self
    attr_accessor :base, :cache

    def load_cache
      @cache ||= File.exist?(CACHE_FILE) ? JSON.parse(File.read(CACHE_FILE)) : {}
    rescue JSON::ParserError
      @cache = {}
    end

    def save_cache
      FileUtils.mkdir_p(File.dirname(CACHE_FILE))
      File.write(CACHE_FILE, JSON.pretty_generate(@cache.sort.to_h))
    end

    # Fetch any urls we don't already know about, in parallel.
    def prefetch(urls)
      missing = urls.compact.uniq.reject { |u| cache.key?(u) }
      return if missing.empty?

      Jekyll.logger.info "Media dimensions:", "fetching #{missing.size} from imgix"
      queue = Queue.new
      missing.each { |u| queue << u }
      THREADS.times.map do
        Thread.new do
          while (url = (queue.pop(true) rescue nil))
            dims = fetch(url)
            cache[url] = dims if dims
          end
        end
      end.each(&:join)
      save_cache
    end

    def lookup(url)
      return nil if url.nil? || url.to_s.empty?
      prefetch([url]) unless cache.key?(url)
      cache[url]
    end

    def fetch(url)
      uri = URI("#{base}#{url}?fm=json")
      res = Net::HTTP.get_response(uri)
      return nil unless res.is_a?(Net::HTTPSuccess)

      data = JSON.parse(res.body)
      w = data["PixelWidth"].to_i
      h = data["PixelHeight"].to_i
      return nil if w.zero? || h.zero?

      # EXIF orientations 5-8 are rotated 90°; imgix serves them upright.
      w, h = h, w if (5..8).cover?(data["Orientation"].to_i)
      [w, h]
    rescue StandardError => e
      Jekyll.logger.warn "Media dimensions:", "#{url} – #{e.message}"
      nil
    end
  end

  module Filter
    # {{ url | media_dimensions }} => [width, height] or nil
    def media_dimensions(url)
      MediaDimensions.lookup(url)
    end
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  MediaDimensions.base = site.config["image_base"]
  MediaDimensions.load_cache

  urls = []
  site.data.fetch("galleries", {}).each_value do |items|
    Array(items).each { |item| urls << (item["placeholder"] || item["url"]) }
  end
  site.posts.docs.each do |post|
    urls << post.data.dig("hero", "url")
    post.content.scan(/include image\.html url="([^"]+)"/) { |m| urls << m.first }
  end

  MediaDimensions.prefetch(urls)
end

Liquid::Template.register_filter(MediaDimensions::Filter)
