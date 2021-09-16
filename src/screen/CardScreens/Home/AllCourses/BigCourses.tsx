import * as React from 'react';
import { useEffect, useRef } from 'react';
import { NavigatorComponentProps } from '../../../index';
import { useStore } from '../../../../store';
import BaseView from '../../../../component/BaseView';
import { FlatListCard } from '../../../../component/FlatListCard';
import { AllCoursesPlaceholder } from '../../../../component/skeleton/AllCoursesPlaceholder';
import { throttle } from '../../../../common/tools';
import { tw } from 'react-native-tailwindcss';
import { LESSON_TYPE_BIG } from '../../../../common/status-module';
import { observer, Observer } from 'mobx-react-lite';

type Props = {};
export const BigCourses: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { homeStore, lessonDetailStore } = useStore();
    const baseView = useRef<any>(undefined);
    useEffect(() => {
      (async () => {
        await homeStore.getAll(LESSON_TYPE_BIG, true);
      })();
    }, [homeStore]);
    useEffect(() => {
      lessonDetailStore.lessonDetailPlaceholder = false;
    }, [lessonDetailStore]);

    const getLesson = async (id: string) => {
      navigation.navigate('Main', { screen: 'LessonDetail', params: { lessonId: id } });
    };

    const getAddData = async () => {
      if (homeStore.allSearchBigClass.length % 6 === 0) {
        await homeStore.getAll(LESSON_TYPE_BIG, false);
      }
    };

    const getNewData = async () => {
      await homeStore.getAll(LESSON_TYPE_BIG, true);
    };

    const renderContent = (): JSX.Element => {
      if (lessonDetailStore.lessonDetailPlaceholder) {
        return <AllCoursesPlaceholder />;
      } else {
        return (
          <FlatListCard
            type={LESSON_TYPE_BIG}
            getAddData={getAddData}
            getNewData={getNewData}
            allSearchSmallClass={homeStore.allSearchBigClass.slice()}
            navigation={throttle(async (e) => {
              await getLesson(e);
            })}
          />
        );
      }
    };
    return (
      <Observer>
        {() => (
          <BaseView useSafeArea={false} ref={baseView} style={[tw.flex1]}>
            {renderContent()}
          </BaseView>
        )}
      </Observer>
    );
  }
);
