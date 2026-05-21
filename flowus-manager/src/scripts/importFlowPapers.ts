import { paperStorage } from './paperManager';
import flowPapersData from '../flowUsPapers.json';

const papers = flowPapersData.papers.map((paper: any) => ({
  id: paper.id,
  title: paper.title,
  authors: [],
  journal: '',
  year: new Date(paper.created).getFullYear(),
  doi: '',
  url: `https://flowus.cn/docs/${paper.id}`,
  abstract: '',
  keywords: [],
  tags: [],
  createdAt: paper.created,
  updatedAt: paper.edited,
  importedFrom: 'FlowUs API Export'
}));

console.log(`Found ${papers.length} papers to import`);

const existingPapers = paperStorage.loadPapers();
const existingIds = new Set(existingPapers.map(p => p.id));

let added = 0;
for (const paper of papers) {
  if (!existingIds.has(paper.id)) {
    paperStorage.addPaper(paper);
    added++;
  }
}

console.log(`Successfully imported ${added} new papers`);
console.log(`Total papers in storage: ${paperStorage.loadPapers().length}`);
