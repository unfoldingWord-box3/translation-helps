/**
 * TranslationQuestionsPanel.jsx
 * tQ entries for comprehension.
 */

import React, { useContext } from 'react';
import { ResourcesContext } from '../context/ResourcesContext';

export function TranslationQuestionsPanel() {
  const { resources } = useContext(ResourcesContext);
  const questions = resources.tq?.data || [];
  if (!questions.length) return null;
  return (
    <section>
      <h3>Translation Questions</h3>
      <ul>
        {questions.map((q, i) => (
          <li key={i}>{q.Question || JSON.stringify(q)}</li>
        ))}
      </ul>
    </section>
  );
}