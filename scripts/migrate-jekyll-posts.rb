# frozen_string_literal: true

require 'date'
require 'fileutils'
require 'json'
require 'yaml'

ROOT = File.expand_path('..', __dir__)
POSTS_DIR = File.join(ROOT, '_posts')
CONTENTS_DIR = File.join(ROOT, 'contents')

def plain_description(body)
  body
    .gsub(/```.*?```/m, ' ')
    .gsub(/<[^>]+>/, ' ')
    .gsub(/!\[[^\]]*\]\([^)]*\)/, ' ')
    .gsub(/\[([^\]]+)\]\([^)]*\)/, '\\1')
    .gsub(/[#>*_`~|-]/, ' ')
    .gsub(/\s+/, ' ')
    .strip[0, 160]
end

def convert_bookmarks(body)
  body.gsub(/<div>\s*\{%\s*include\s+bookmark\.html(?<args>.*?)%\}\s*<\/div>/m) do
    args = Regexp.last_match[:args]
    url = args[/url="([^"]+)"/, 1]
    title = args[/title="([^"]+)"/, 1] || url
    url ? "[#{title}](#{url})" : ''
  end
end

FileUtils.rm_rf(CONTENTS_DIR)
FileUtils.mkdir_p(CONTENTS_DIR)

Dir.glob(File.join(POSTS_DIR, '*.md')).sort.each do |source|
  raw = File.read(source)
  match = raw.match(/\A---\s*\n(.*?)\n---\s*(?:\n|\z)/m)
  raise "Invalid front matter: #{source}" unless match

  metadata = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
  body = convert_bookmarks(raw[match.end(0)..] || '')
  basename = File.basename(source, '.md').sub(/^\d{4}-\d{1,2}-\d{1,2}-/, '')
  destination = File.join(CONTENTS_DIR, basename)
  FileUtils.mkdir_p(destination)

  image = metadata['image'].to_s.strip
  hero_image = nil
  hero_image_url = nil
  if image.start_with?('http://', 'https://')
    hero_image_url = image
  elsif !image.empty?
    image_source = File.join(ROOT, image.sub(%r{\A/}, ''))
    if File.file?(image_source)
      extension = File.extname(image_source)
      hero_image = "./heroImage#{extension}"
      FileUtils.cp(image_source, File.join(destination, "heroImage#{extension}"))
    end
  end

  tags = Array(metadata['tags']) | Array(metadata['categories'])
  date = metadata['date'].respond_to?(:strftime) ? metadata['date'].strftime('%Y-%m-%d') : metadata['date'].to_s[0, 10]
  title = metadata['title'].to_s

  frontmatter = [
    '---',
    "title: #{title.to_json}",
    "description: #{plain_description(body).to_json}",
    "date: #{date}",
    "slug: #{("/#{basename}/").to_json}",
    "tags: #{tags.map(&:to_s).to_json}",
    ("heroImage: #{hero_image}" if hero_image),
    ("heroImageUrl: #{hero_image_url.to_json}" if hero_image_url),
    "heroImageAlt: #{title.to_json}",
    '---',
  ].compact.join("\n")

  File.write(File.join(destination, 'index.md'), "#{frontmatter}\n\n#{body.lstrip}")
end

warn "Migrated #{Dir.glob(File.join(CONTENTS_DIR, '*', 'index.md')).length} posts"
