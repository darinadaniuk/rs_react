import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { About } from './about';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      photoAlt: 'Me',
      name: 'Darya Daniuk',
      title: 'RSS React course student',
      p1: 'Hi! My name is Darya. Thanks for taking the time to read my intro.',
      p2: "I currently live in Ottawa, Canada, where I've been for the past three years after moving here with my family and our two cats. Before settling in Canada, we lived in Kyiv, Ukraine.",
      p3: "In my free time, I enjoy knitting and reading. Lately, I've been diving into books my son",
      p4: "I'm always excited to meet new people, learn new things, and share experiences.",
      githubAria: 'Open GitHub',
      rssAria: 'RSS School',
      rssAlt: 'RSS logo',
    };
    return dict[key] ?? key;
  },
}));

vi.mock('next/image', () => {
  const Img = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />;
  return { __esModule: true, default: Img };
});

vi.mock('@rs-react/assets/me-snow.jpg', () => ({
  __esModule: true,
  default: 'me.jpg',
}));

vi.mock('react-icons/fa', () => {
  const FaGithub: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg data-testid="gh-icon" {...props} />
  );
  return { FaGithub };
});

describe('About', () => {
  it('should render the photo with alt text "Me"', () => {
    render(<About />);
    expect(screen.getByAltText('Me')).toBeInTheDocument();
  });

  it('should render the name and title', () => {
    render(<About />);
    expect(screen.getByText('Darya Daniuk')).toBeInTheDocument();
    expect(screen.getByText('RSS React course student')).toBeInTheDocument();
  });

  it('should render all introduction paragraphs', () => {
    render(<About />);
    expect(
      screen.getByText(/Hi! My name is Darya\. Thanks for taking the time to read my intro\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /I currently live in Ottawa, Canada, where I've been for the past three years/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /In my free time, I enjoy knitting and reading\. Lately, I've been diving into books my son/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /I'm always excited to meet new people, learn new things, and share experiences\./i,
      ),
    ).toBeInTheDocument();
  });

  it('should render the github link with correct href and icon', () => {
    render(<About />);
    const githubLink = screen.getByTestId('github-link');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/darinadaniuk');
    expect(githubLink.querySelector('svg')).toBeInTheDocument();
  });

  it('should render the RSS School link with correct href and image', () => {
    render(<About />);
    const rssLink = screen.getByRole('link', { name: /rss school/i });
    expect(rssLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(screen.getByAltText(/rss logo/i)).toBeInTheDocument();
  });
});
