export interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year?: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  keywords?: string[];
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  importedFrom?: string;
}

export interface ImportExportSettings {
  defaultFormat: 'json' | 'csv' | 'bibtex' | 'ris';
  includeAbstract: boolean;
  includeKeywords: boolean;
  includeNotes: boolean;
}
