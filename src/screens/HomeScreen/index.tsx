import Navbar from '../../components/Navbar';
import ContentDashboard from '../../components/ContentDashboard';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div style={{ height: '80vh' }}>
        <ContentDashboard />
      </div>
    </div>
  );
}
