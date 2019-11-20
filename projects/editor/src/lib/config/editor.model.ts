export interface SelectOption {
  label: string;
  value: string;
}

export interface Font {
  name: string;
  class: string;
}

export interface CustomClass {
  name: string;
  class: string;
  tag?: string;
}

export interface IcyEditorConfig {
  editable?: boolean;
  spellcheck?: boolean;
  translate?: 'yes' | 'no' | string;
  height?: 'auto' | string;
  minHeight?: '0' | string;
  maxHeight?: 'auto' | string;
  width?: 'auto' | string;
  minWidth?: '0' | string;
  maxWidth?: 'auto' | string;
  enableToolbar?: boolean;
  showToolbar?: boolean;
  placeholder?: string;
  defaultFontName?: string;
  defaultFontSize?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | string;
  uploadUrl?: string;
  fonts?: Font[];
  customClass?: CustomClass[];
  toolbarPosition?: 'top' | 'bottom';
  outline?: boolean;
  toolbarHiddenButtons?: string[];
}
