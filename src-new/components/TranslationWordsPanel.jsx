/**
 * TranslationWordsPanel.jsx
 * Responsible for displaying linked translation words articles from TWL.
 */
import React, { useContext, useEffect, useState } from 'react';
import { ResourcesContext } from '../context/ResourcesContext';

/**
 * @param {object} props
 * @param {object} props.reference - Reference object { bookId, chapter, verse }
 */
export function TranslationWordsPanel({ reference }) {
  const { resources } = useContext(ResourcesContext);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (resources.twl?.data?.links) {
      setLinks(resources.twl.data.links);
    }
  }, [resources]);

  if (!reference?.bookId) return null;

  return (
    <section>
      <h3>Translation Words Links</h3>
      <ul>
        {links.map((link, i) => (
          <li key={i}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}