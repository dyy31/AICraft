export interface Story {
  id: string;
  title: string;
  date: string;
  preview: string;
}

export const recentStories: Story[] = [
  {
    id: '1',
    title: "Mom's Birthday Celebration",
    date: 'Summer 1995',
    preview: 'A warm afternoon filled with laughter...'
  },
  {
    id: '2',
    title: 'First Family Vacation',
    date: 'Spring 1992',
    preview: 'The ocean waves crashed gently...'
  }
];