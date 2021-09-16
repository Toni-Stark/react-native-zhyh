import * as React from 'react';
import { tw } from 'react-native-tailwindcss';
import BaseView from '../../../../component/BaseView';
import { useEffect, useRef } from 'react';
import { NavigatorComponentProps } from '../../../index';
import { useStore } from '../../../../store';
import { FlatListCard } from '../../../../component/FlatListCard';
import { throttle } from '../../../../common/tools';
import { LESSON_TYPE_SMALL } from '../../../../common/status-module';
import { AllCoursesPlaceholder } from '../../../../component/skeleton/AllCoursesPlaceholder';
import { observer } from 'mobx-react-lite';

type Props = {};
export const SmallCourses: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { homeStore, lessonDetailStore } = useStore();

    const baseView = useRef<any>(undefined);

    useEffect(() => {
      (async () => {
        await homeStore.getAll(LESSON_TYPE_SMALL, true);
      })();
    }, [homeStore]);

    const getLesson = async (id: string) => {
      navigation.navigate('Main', { screen: 'LessonDetail', params: { lessonId: id } });
    };

    const getAddData = async () => {
      if (homeStore.allSearchSmallClass.length % 6 === 0) {
        await homeStore.getAll(LESSON_TYPE_SMALL, false);
      }
    };

    const getNewData = async () => {
      await homeStore.getAll(LESSON_TYPE_SMALL, true);
    };

    const renderContent = (): JSX.Element => {
      if (lessonDetailStore.lessonDetailPlaceholder) {
        return <AllCoursesPlaceholder />;
      } else {
        return (
          <FlatListCard
            type={LESSON_TYPE_SMALL}
            getAddData={getAddData}
            getNewData={getNewData}
            allSearchSmallClass={homeStore.allSearchSmallClass.slice()}
            navigation={throttle(async (e) => {
              await getLesson(e);
            })}
          />
        );
      }
    };
    return (
      <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
        {renderContent()}
      </BaseView>
    );
  }
);
