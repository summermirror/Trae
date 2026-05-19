import { useMemo } from 'react';
import { Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useFlowusData } from '../hooks/useFlowusData';
import StatCard from '../components/analytics/StatCard';
import VisitChart from '../components/analytics/VisitChart';
import InteractionChart from '../components/analytics/InteractionChart';
import ContentPerformance from '../components/analytics/ContentPerformance';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import { calculateAnalytics, getInteractionDistribution } from '../services/analytics';

export default function Analytics() {
  const { articles, loading, error, refetch } = useFlowusData();

  const analytics = useMemo(() => calculateAnalytics(articles), [articles]);
  const interactionData = useMemo(() => getInteractionDistribution(articles), [articles]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;

  return (
    <div className="space-y-6">
      <Header onRefresh={refetch} lastSyncTime={new Date()} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总访问量"
          value={analytics.totalViews.toLocaleString()}
          change={12.5}
          icon={Eye}
          color="blue"
        />
        <StatCard
          title="总点赞数"
          value={analytics.totalLikes.toLocaleString()}
          change={8.3}
          icon={Heart}
          color="red"
        />
        <StatCard
          title="总评论数"
          value={analytics.totalComments.toLocaleString()}
          change={-2.1}
          icon={MessageCircle}
          color="green"
        />
        <StatCard
          title="总分享数"
          value={analytics.totalShares.toLocaleString()}
          change={15.7}
          icon={Share2}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitChart
          data={analytics.viewTrends.map((t) => ({
            date: t.date.slice(5),
            views: t.value,
            visitors: Math.floor(t.value * 0.7),
          }))}
        />
        <InteractionChart data={interactionData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentPerformance articles={articles} metric="views" />
        <ContentPerformance articles={articles} metric="likes" />
      </div>
    </div>
  );
}
