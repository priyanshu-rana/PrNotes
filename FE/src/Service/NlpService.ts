import nlp from "compromise";

export class NlpService {
  processText(text: string) {
    const doc = nlp(text);
    return {
      title: doc.sentences().first().text() || "Untitled Note",
      description: text,
      tags: doc.topics().out("array").length
        ? doc.topics().out("array")
        : ["unlabeled"],
    };
  }
}

export const nlpService = new NlpService();
