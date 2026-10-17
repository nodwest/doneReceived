import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateTaskButton } from '@features/create-task';
import { BottomNav } from '@widgets/bottom-nav';
import { HomeHeader } from '@widgets/home-header';
import { HomeSummary } from '@widgets/home-summary';
import { RecentActivity } from '@widgets/recent-activity';
import {
  familySummaryMock,
  parentMock,
  recentActivityMock,
} from '@shared/mocks';
import { styles } from './parent-home.styled';

export function ParentHomePage() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader
            greeting={parentMock.greeting}
            name={parentMock.name}
            avatar={parentMock.avatar}
          />
          <HomeSummary {...familySummaryMock} />
          <CreateTaskButton />
          <RecentActivity items={recentActivityMock} />
        </ScrollView>
        <BottomNav
          activeKey="home"
          onNavigate={(key) => key === 'home' && router.replace('/')}
        />
      </SafeAreaView>
    </View>
  );
}
