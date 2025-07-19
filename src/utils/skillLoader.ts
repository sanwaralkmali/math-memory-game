import { SkillData, GamePair } from '@/types/game';

export async function loadSkillData(skillId: string): Promise<SkillData | null> {
  // If you need to load questions, use loadSkillQuestions instead
  const data = (await import(`../data/skills/${skillId}.json`)) as SkillData;
  return data;
}

const convertRationalFiles = import.meta.glob('../data/skills/convert-rational-*.json', { eager: false });

export async function loadSkillQuestions(skillId: string, gameType: string): Promise<GamePair[]> {
  if (skillId === 'convert-rational') {
    let file = '';
    switch (gameType) {
      case 'fraction-decimal':
        file = 'convert-rational-fraction-decimal.json';
        break;
      case 'fraction-percentage':
        file = 'convert-rational-fraction-percentage.json';
        break;
      case 'percentage-decimal':
        file = 'convert-rational-percentage-decimal.json';
        break;
      case 'mixed':
        file = 'convert-rational-mixed.json';
        break;
      default:
        file = 'convert-rational-fraction-decimal.json';
    }
    const relPath = `../data/skills/${file}`;
    const loader = convertRationalFiles[relPath];
    if (!loader) throw new Error('Questions file not found: ' + relPath);
    const data = (await loader()) as { questions: GamePair[] };
    return data.questions;
  }
  // fallback for other skills
  const data = (await import(`../data/skills/${skillId}.json`)) as { questions: GamePair[] };
  return data.questions;
}

export function getAvailableSkills(): string[] {
  return ['convert-rational', 'basic-addition'];
}