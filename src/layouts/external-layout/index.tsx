import ScrollToTop from 'components/animation/scroll-to-top';
import { ExternalNav } from 'components/partials/external-nav';

import { useOutlet } from 'react-router-dom';

const ExternalLayout = () => {
  const outlet = useOutlet();

  return (
    <main className='relative h-auto w-full'>
      <ScrollToTop />
      <ExternalNav />
      {outlet}
      {/* <PreFooter /> */}
      {/* <Footer /> */}
    </main>
  );
};

export default ExternalLayout;
