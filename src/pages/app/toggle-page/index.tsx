import FunkyPagesHero from 'components/general/FunkyPagesHero';
import PillTabs from 'components/general/PillTabs';
import SearchComboBox from 'components/general/SearchComboBox';
import { useState } from 'react';
import MasterClassCard from 'components/general/MasterClassCard';
import filmImg from 'assets/image/masterClassImg.png';

import { useQuery } from '@tanstack/react-query';
import contentService from 'services/content';
import { processError } from 'helper/error';
import AnnouncementToggle from './annoucement';
import ShowSections from './showSections';
type filterTypes = 'All' | 'Upcoming' | 'Completed';

const generalFilters: filterTypes[] = ['All', 'Upcoming', 'Completed'];

const TogglePage = () => {
  const [currFilter, setCurrFilter] = useState<filterTypes>('All');

  return (
    <div className='container flex h-full w-full max-w-[180.75rem] flex-col gap-8 overflow-auto px-container-md pb-[2.1rem]'>
      <FunkyPagesHero
        description='List of settings and configurations for the web app'
        title='Toggle Web App Sections'
      />
      <h3 className='text-lg font-bold'>Announcement Bar</h3>
      <AnnouncementToggle />
      <h3 className='text-lg font-bold'>Sections</h3>
      <ShowSections />
    </div>
  );
};

export default TogglePage;
