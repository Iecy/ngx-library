import { IcyEditorConfig } from './editor.model';

export const defaultConfig: IcyEditorConfig = {
  editable: true,
  spellcheck: true,
  translate: 'yes',
  height: 'auto',
  minHeight: '0',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  maxWidth: 'auto',
  enableToolbar: true,
  showToolbar: true,
  placeholder: '请输入信息...',
  defaultFontName: '',
  defaultFontSize: '',
  fonts: [
    {name: 'Arial', class: 'arial'},
    {name: 'Helvetica Neue', class: 'helvetica-neue'},
    {name: 'Microsoft YaHei', class: 'microsoft-yahei'}
  ],
  toolbarPosition: 'top',
  outline: true,
};
