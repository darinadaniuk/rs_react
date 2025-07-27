import { FaGithub } from 'react-icons/fa';

import mePhoto from '@rs-react/assets/me-snow.jpg';
import rssLogo from '@rs-react/assets/rss-logo.svg';

import './about.css';

export function About() {
  return (
    <div className="about">
      <section className="about-photo">
        <img src={mePhoto} alt="me" />
      </section>
      <section>
        <h3 className="about-name">Darya Daniuk</h3>
        <p className="about-title">RSS React course student</p>
        <div className="about-introduction">
          <p>
            {
              'Hi! My name is Darya. Thanks for taking the time to read my intro.'
            }
          </p>
          <p>
            {
              "I currently live in Ottawa, Canada, where I've been for the past three years after moving here with my family and our two cats. Before settling in Canada, we lived in Kyiv, Ukraine."
            }
          </p>
          <p>
            {
              "In my free time, I enjoy knitting and reading. Lately, I've been diving into books my son reads, and the last one we read together was Diary of a Wimpy Kid. It had me laughing out loud. so hilarious!"
            }
          </p>
          <p>
            {
              "I'm always excited to meet new people, learn new things, and share experiences. Feel free to stop by and say hi!"
            }
          </p>
        </div>
        <div className="about-links">
          <a
            href="https://github.com/darinadaniuk"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="github-link"
          >
            <FaGithub size={32} color="#64656a" />
          </a>
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={rssLogo} alt="rss logo" />
          </a>
        </div>
      </section>
    </div>
  );
}
