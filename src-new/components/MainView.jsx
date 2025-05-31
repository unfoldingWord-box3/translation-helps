/**
 * MainView.jsx
 * Orchestrates the main content area including scripture text, navigation tabs, and helps panels.
 */

import React, { useContext } from 'react';
import { ReferenceContext } from '../context/ReferenceContext';
import { ScripturePanel } from './ScripturePanel';
import { VerseTabs } from './VerseTabs';
import { TranslationNotesPanel } from './TranslationNotesPanel';
import { TranslationQuestionsPanel } from './TranslationQuestionsPanel';
import { TranslationWordsPanel } from './TranslationWordsPanel';

export function MainView() {
  const { reference } = useContext(ReferenceContext);
  return (
    <main data-testid="main-view">
      <VerseTabs />
      <ScripturePanel reference={reference} />
      <TranslationNotesPanel />
      <TranslationQuestionsPanel />
      <TranslationWordsPanel reference={reference} />
    </main>
  );
}