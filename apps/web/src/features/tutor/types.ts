export type TutorStepAction =
  | 'start'
  | 'select_style'
  | 'select_concept'
  | 'change_style'
  | 'change_concept';

export interface TutorOptionButton {
  id: string;
  label: string;
  action: TutorStepAction | 'go_to_assessment';
  payload?: { learningStyle?: string; conceptId?: string };
  recommended?: boolean;
}
