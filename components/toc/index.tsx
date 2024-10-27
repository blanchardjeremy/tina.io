import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styled, { css } from 'styled-components';
import RightArrowSvg from '../../public/svg/right-arrow.svg';
import { getDocId } from 'utils/docs/getDocIds';

interface TocProps {
  tocItems: Array<{ type: string; text: string }>;
  activeIds: string[];
}

const generateMarkdown = (tocItems: Array<{ type: string; text: string }>) => {
  return tocItems
    .map((item) => {
      const anchor = getDocId(item.text);
      const prefix = item.type === 'h3' ? '  ' : '';
      return `${prefix}- [${item.text}](#${anchor})`;
    })
    .join('\n');
};

const ToC = ({ tocItems, activeIds }: TocProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const close = () => setIsOpen(false);
    const allLinks = document.querySelectorAll('a');
    if (allLinks.length > 0) {
      allLinks.forEach((a) => a.addEventListener('click', close));
    }
    return () => {
      if (allLinks.length > 0) {
        allLinks.forEach((a) => a.removeEventListener('click', close));
      }
    };
  }, []);

  if (!tocItems || tocItems.length === 0) {
    return null;
  }

  const tocMarkdown = generateMarkdown(tocItems);

  return (
    <TocWrapper>
      <TocButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span>{isOpen ? 'Hide Table of Contents' : ''}</span>
        <RightArrowSvg />
      </TocButton>
      <TocContent activeIds={activeIds} isOpen={isOpen}>
        <TocDesktopHeader>Table of Contents</TocDesktopHeader>
        <ReactMarkdown>{tocMarkdown}</ReactMarkdown>
      </TocContent>
    </TocWrapper>
  );
};

export default ToC;

export const TocDesktopHeader = styled.span`
  display: none;
  font-size: 1rem;
  color: var(--color-secondary);
  opacity: 0.5;
  background: transparent;
  line-height: 1;
  margin-bottom: 1.125rem;
`;

export const TocWrapper = styled.div`
  margin-bottom: -0.375rem;
  flex: 0 0 auto;

  @media (min-width: 1200px) {
    position: sticky;
    top: 1.5rem;
  }
`;

export const TocButton = styled.button<{ isOpen: boolean }>`
  display: block;
  padding: 0;
  outline: none;
  border: none;
  color: var(--color-secondary);
  opacity: 0.65;
  background: transparent;
  cursor: pointer;
  transition: opacity 185ms ease-out;
  display: flex;
  align-items: center;
  line-height: 1;
  margin-bottom: 1.125rem;

  span {
    margin-right: 0.5rem;
  }

  svg {
    position: ${(props) => (!props.isOpen ? 'absolute' : 'relative')};
    right: ${(props) => (!props.isOpen ? '1rem' : 'auto')};
    width: 1.25rem;
    height: auto;
    transform: rotate(180deg);
    fill: var(--color-grey);
    transform-origin: 50% 50%;
    background-color: orange;
    border-radius: 0 15px 15px 0;
    transition: opacity 180ms ease-out, transform 180ms ease-out,
      right 180ms ease-out;
  }

  :hover,
  :focus {
    opacity: 1;

    svg {
      opacity: 1;
    }
  }

  ${(props) =>
    props.isOpen &&
    css`
      color: var(--color-orange);

      svg {
        transform: rotate(90deg);
        opacity: 1;
      }
    `};
`;

export interface TocContentProps {
  isOpen: boolean;
  activeIds: string[];
}

export const TocContent = styled.div<TocContentProps>`
  display: block;
  width: 100%;
  line-height: 1.25;
  height: auto;
  max-height: 0;
  overflow: hidden;
  transition: all 400ms ease-out;

  ${(props) =>
    props.activeIds &&
    props.activeIds.map(
      (id) =>
        css`
          a[href='#${id}'] {
            color: var(--color-orange);
            text-decoration: none;
          }
        `
    )}

  ${(props) =>
    props.isOpen
      ? css`
          transition: all 750ms ease-in;
          max-height: 1500px;
        `
      : ``};

  /* Top Level Styles */

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  li {
    display: block;
    margin: 0;
    padding: 0.375rem 0 0.375rem 0;
  }

  a {
    color: var(--color-secondary);
    /* font-family: var(--font-tuner); */
  }

  /* Hide underline except on hover or focus */
  a {
    :not(:focus) {
      :not(:hover) {
        text-decoration-color: transparent !important;
      }
    }
  }

  /* Nested Styles */
  ul {
    ul {
      padding: 0.125rem 0 0.125rem 0.75rem;

      li {
        padding: 0.25rem 1.5rem 0.25rem 0;

        &:last-child {
          padding-bottom: 0rem;
        }
      }

      a {
        font-size: 0.9375rem;
        font-family: var(--font-primary);
      }
    }
  }
`;
