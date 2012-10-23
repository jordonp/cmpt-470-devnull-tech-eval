#!/usr/bin/env ruby
require 'rubygems'
require 'json'

filename = ARGV[0]
vertices = [];
normals = [];
texCoords = [];
faces = [];
missingTexCoords = false;

File.open(filename) do |f|
  f.each_line do |line|
    case line[0..1];
    when 'v '
      vertex = []
      line[1..line.length-1].split.each do |value|
        vertex << value.to_f
      end
      vertices << vertex
    when 'vt'
      texCoord = []
      line[2..line.length-1].split.each do |value|
        texCoord << value.to_f
      end
      texCoords << texCoord
    when 'vn'
      normal = []
      line[2..line.length-1].split.each do |value|
        normal << value.to_f
      end
      normals << normal
    when 'f '
      face = []
      line[1..line.length-1].split.each do |faceValue|
        missingTexCoords = faceValue.include? '//'
        faceTri = []
        faceValue.split('/').each do |value|
          faceTri << (value.to_i - 1)
        end
        face << faceTri
      end
      faces << face
    end
  end
end

model =  {"indices" => [], "normal" => [], "position" => []}

if !missingTexCoords
  model["texCoord"] = []
end

faceCounter = 0;

faces.each do |face|
  face.each_with_index do |faceTri, i|
    if i > 2
      face[0..i].each_with_index do |newFaceTri, j|
        next if j == ((i+1)%3)
        vertices[newFaceTri[0]].each do |vertexCoord|
          model["position"] << vertexCoord
        end

        if !missingTexCoords
          texCoords[newFaceTri[1]][0..1].each do |texCoord|
            model["texCoord"] << texCoord
          end
        end

        normals[newFaceTri[2]].each do |normalCoord|
          model["normal"] << normalCoord
        end

        model["indices"] << faceCounter
        faceCounter = faceCounter + 1
      end
    else
      vertices[faceTri[0]].each do |vertexCoord|
        model["position"] << vertexCoord
      end

      if !missingTexCoords
        texCoords[faceTri[1]][0..1].each do |texCoord|
          model["texCoord"] << texCoord
        end
      end

      normals[faceTri[2]].each do |normalCoord|
        model["normal"] << normalCoord
      end

      model["indices"] << faceCounter
      faceCounter = faceCounter + 1
    end
  end
end

output = File.new( filename.split(".")[0] + ".json", "w")
output.write(model.to_json)
output.close