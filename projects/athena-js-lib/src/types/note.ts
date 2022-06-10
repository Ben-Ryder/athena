export interface INoteContent {
  title: string,
  body?: string | null,
}

export interface INoteContentUpdate {
  title?: string,
  body?: string | null,
}

export interface INote extends INoteContent {
  id: string,
}

export interface INoteDecryptionResult {
  notes: INote[],
  invalidNotes?: INote[],
}
