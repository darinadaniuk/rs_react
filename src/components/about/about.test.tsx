import { render, screen } from '@testing-library/react';

import { About } from './about';

describe('About', () => {
  it('should render the photo with alt text "me"', () => {
    render(<About />);
    const img = screen.getByAltText('Me');
    expect(img).toBeInTheDocument();
  });

  it('should render the name and title', () => {
    render(<About />);
    expect(screen.getByText('Darya Daniuk')).toBeInTheDocument();
    expect(screen.getByText('RSS React course student')).toBeInTheDocument();
  });

  it('should render all introduction paragraphs', () => {
    render(<About />);
    expect(
      screen.getByText(
        /Hi! My name is Darya. Thanks for taking the time to read my intro./
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /I currently live in Ottawa, Canada, where I've been for the past three years/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /In my free time, I enjoy knitting and reading. Lately, I've been diving into books/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /I'm always excited to meet new people, learn new things, and share experiences/
      )
    ).toBeInTheDocument();
  });

  it('should render the github link with correct href and icon', () => {
    render(<About />);
    const githubLink = screen.getByTestId('github-link');
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/darinadaniuk'
    );
    expect(githubLink.querySelector('svg')).toBeInTheDocument();
  });

  it('should render the RSS School link with correct href and image', () => {
    render(<About />);
    const rssLink = screen.getByRole('link', { name: /rss logo/i });
    expect(rssLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    const img = screen.getByAltText(/rss logo/i);
    expect(img).toBeInTheDocument();
  });
});
