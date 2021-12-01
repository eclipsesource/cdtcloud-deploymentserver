// Original file: src\cc\arduino\cli\commands\v1\commands.proto


export interface ArchiveSketchRequest {
  'sketch_path'?: (string);
  'archive_path'?: (string);
  'include_build_dir'?: (boolean);
}

export interface ArchiveSketchRequest__Output {
  'sketch_path': (string);
  'archive_path': (string);
  'include_build_dir': (boolean);
}
