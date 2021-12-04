// Original file: src\cc\arduino\cli\commands\v1\commands.proto


export interface LoadSketchResponse {
  'main_file'?: (string);
  'location_path'?: (string);
  'other_sketch_files'?: (string)[];
  'additional_files'?: (string)[];
  'root_folder_files'?: (string)[];
}

export interface LoadSketchResponse__Output {
  'main_file': (string);
  'location_path': (string);
  'other_sketch_files': (string)[];
  'additional_files': (string)[];
  'root_folder_files': (string)[];
}
