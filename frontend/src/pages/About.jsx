import AboutHero from '@/components/About/AboutHero';
import AboutStory from '@/components/About/AboutStory';
import AboutMissionVision from '@/components/About/AboutMissionVision';
import AboutStats from '@/components/About/AboutStats';
import AboutTeam from '@/components/About/AboutTeam';
import AboutValues from '@/components/About/AboutValues';
import AboutCTA from '@/components/About/AboutCTA';

export default function About() {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
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
