import { useState, useEffect } from 'react';
import type { Paper } from '../types/paper';
import { paperStorage, importPapers, exportPapers, downloadFile } from '../services/paperManager';

export function usePapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedPapers = paperStorage.loadPapers();
    setPapers(loadedPapers);
    setLoading(false);
  }, []);

  const addPaper = (paper: Paper) => {
    paperStorage.addPaper(paper);
    setPapers(prev => [...prev, paper]);
  };

  const updatePaper = (id: string, updates: Partial<Paper>) => {
    paperStorage.updatePaper(id, updates);
    setPapers(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePaper = (id: string) => {
    paperStorage.deletePaper(id);
    setPapers(prev => prev.filter(p => p.id !== id));
  };

  const importFromJSON = (jsonString: string) => {
    const imported = importPapers.fromJSON(jsonString);
    imported.forEach(paper => paperStorage.addPaper(paper));
    setPapers(prev => [...prev, ...imported]);
    return imported.length;
  };

  const importFromCSV = (csvString: string) => {
    const imported = importPapers.fromCSV(csvString);
    imported.forEach(paper => paperStorage.addPaper(paper));
    setPapers(prev => [...prev, ...imported]);
    return imported.length;
  };

  const importFromBibTeX = (bibtexString: string) => {
    const imported = importPapers.fromBibTeX(bibtexString);
    imported.forEach(paper => paperStorage.addPaper(paper));
    setPapers(prev => [...prev, ...imported]);
    return imported.length;
  };

  const importFromText = (text: string, sourceUrl?: string) => {
    const imported = importPapers.fromText(text, sourceUrl);
    imported.forEach(paper => paperStorage.addPaper(paper));
    setPapers(prev => [...prev, ...imported]);
    return imported.length;
  };

  const exportToJSON = (settings?: any) => {
    const content = exportPapers.toJSON(papers, settings);
    downloadFile(content, `papers_${Date.now()}.json`, 'application/json');
  };

  const exportToCSV = (settings?: any) => {
    const content = exportPapers.toCSV(papers, settings);
    downloadFile(content, `papers_${Date.now()}.csv`, 'text/csv');
  };

  const exportToBibTeX = () => {
    const content = exportPapers.toBibTeX(papers);
    downloadFile(content, `papers_${Date.now()}.bib`, 'text/plain');
  };

  const exportToRIS = () => {
    const content = exportPapers.toRIS(papers);
    downloadFile(content, `papers_${Date.now()}.ris`, 'text/plain');
  };

  const exportToMarkdown = () => {
    const content = exportPapers.toMarkdown(papers);
    downloadFile(content, `papers_${Date.now()}.md`, 'text/markdown');
  };

  const exportToWord = () => {
    const content = exportPapers.toWord(papers);
    downloadFile(content, `papers_${Date.now()}.html`, 'text/html');
  };

  const clearAll = () => {
    paperStorage.clearAll();
    setPapers([]);
  };

  return {
    papers,
    loading,
    addPaper,
    updatePaper,
    deletePaper,
    importFromJSON,
    importFromCSV,
    importFromBibTeX,
    importFromText,
    exportToJSON,
    exportToCSV,
    exportToBibTeX,
    exportToRIS,
    exportToMarkdown,
    exportToWord,
    clearAll,
  };
}
