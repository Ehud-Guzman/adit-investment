import AboutHero from '@/components/About/AboutHero';
import AboutStory from '@/components/About/AboutStory';
import AboutMissionVision from '@/components/About/AboutMissionVision';
import AboutStats from '@/components/About/AboutStats';
import AboutTeam from '@/components/About/AboutTeam';
import AboutValues from '@/components/About/AboutValues';
import AboutCTA from '@/components/About/AboutCTA';

export default function About() {
  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden flex flex-col">

      <AboutHero />
      <AboutStory />
      <AboutMissionVision />
      <AboutStats />
      <AboutTeam />
      <AboutValues />
      <AboutCTA />
    </div>
  );
}
