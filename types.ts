export interface EmailFormData {
  productName: string;
  audience: string;
  mainGoal: string;
  painPoint: string;
  valueProp: string;
  socialProof: string;
  brandName: string;
  senderName: string;
  senderTitle: string;
}

export interface ChecklistItem {
    criterion: string;
    met: boolean;
    description: string;
}

export interface EmailSection {
  name: string;
  content: string;
  checklist: ChecklistItem[];
  summary: string;
  error: string;
}

export interface FinalReview {
  mobile_preview: boolean;
  links_checked: boolean;
  grammar_verified: boolean;
  spam_score_ok: boolean;
  send_time_suggested: string;
  error: string;
}

export interface EmailResult {
  sections: EmailSection[];
  final_review: FinalReview;
  full_email_text: string;
}
