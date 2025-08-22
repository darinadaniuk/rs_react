'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

import mePhoto from '@rs-react/assets/me-snow.jpg';
import './about.css';

export function About() {
  const t = useTranslations('about');

  return (
    <div className="about">
      <section className="about-photo">
        <Image src={mePhoto} alt={t('photoAlt')} width={200} height={320} unoptimized />
      </section>

      <section>
        <h3 className="about-name">{t('name')}</h3>
        <p className="about-title">{t('title')}</p>

        <div className="about-introduction">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <p>{t('p3')}</p>
          <p>{t('p4')}</p>
        </div>

        <div className="about-links">
          <a
            href="https://github.com/darinadaniuk"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="github-link"
            aria-label={t('githubAria')}
            title={t('githubAria')}
          >
            <FaGithub size={32} color="#64656a" />
          </a>

          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('rssAria')}
            title={t('rssAria')}
          >
            <Image src="/rss-logo.svg" alt={t('rssAlt')} width={24} height={24} unoptimized />
          </a>
        </div>
      </section>
    </div>
  );
}
