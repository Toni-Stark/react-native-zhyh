import React, { useEffect, useRef, useState } from 'react';
import { Appbar, Button, Modal, Portal, Text, useTheme } from 'react-native-paper';
import BaseView from '../../../component/BaseView';
import { tw } from 'react-native-tailwindcss';
import { observer } from 'mobx-react-lite';
import { NavigatorComponentProps } from '../../index';
import { FlatList, RefreshControl, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { t } from '../../../common/tools';
import { DiskFolder } from './DiskFolder';
import { AllResourcesAllListType, AllResourcesList, AllResourcesType, BaseUrl, CreateNewFolderType, ResourcesType } from './CloudSeaDiskStore';
import { Api } from '../../../common/api';
import { useStore } from '../../../store';

type Props = {};

export type ClassTypes = {
  type: number;
  name: string;
};

export type CloudDiskType = {
  id: string;
  name: string;
  type: number;
  url?: string;
  size?: string;
};

export const MoveFolderSelect: React.FC<NavigatorComponentProps & Props> = observer(
  ({ navigation }): JSX.Element => {
    const { colors } = useTheme();
    const baseView = useRef<any>();
    const menuMoreSheet = useRef<any>();
    const { cloudSeaDiskStore } = useStore();
    const [refreshing, setRefreshing] = useState(false);
    const [select, setSelect] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('');
    const [folderListAll, setFolderListAll] = useState<AllResourcesAllListType[]>([]);
    const [moveFolderInfo, setMoveFolderInfo] = useState<AllResourcesType | undefined>(undefined);
    const [moveFolderList, setMoveFolderList] = useState<AllResourcesList[]>([]);
    const [parentId, setParentId] = useState<string | undefined>('0');
    const [showMoveModal, setShowMoveModal] = useState(false);

    const LessonFolder = async (param: ResourcesType) => {
      // let params = {
      //   current: param.current,
      //   isPublic: param.isPublic,
      //   parentId: param.parentId,
      //   direction: param.direction,
      //   pageSize: 10
      // };
      let asc = 'ascend';
      console.log(param.current, '所有页码');
      const url =
        BaseUrl +
        '/oss-file/current-user' +
        `?current=${param.current}` +
        '&types=0' +
        // '&direction=' +
        // asc +
        '&pageSize=10' +
        '&parentId=' +
        (param.parentId ? param.parentId : '0');
      return await Api.getInstance.get({ url: url, withToken: true });
    };

    useEffect(() => {
      (async () => {
        let param = {
          current: 1,
          pageSize: 10
        };
        let result = await LessonFolder(param);
        if (result.success) {
          setMoveFolderInfo(result.result);
          setMoveFolderList(result.result.content);
          setParentId('0');
        }
      })();
    }, [cloudSeaDiskStore.selects]);

    const doEnyThings = (id, name, type) => {
      if (type === 0) {
        setParentId(id);
        folderListAll.push({ name: name, id: id, list: moveFolderList });
        setFolderListAll([...folderListAll]);
        let param = {
          current: 1,
          parentId: id,
          pageSize: 10
        };
        LessonFolder(param).then((result) => {
          if (result.success) {
            setMoveFolderInfo(result.result);
            setMoveFolderList(result.result.content);
          }
        });
      }
    };

    const createFolderAPI = (param: CreateNewFolderType) => {
      const params = {
        isFolder: param.isFolder,
        name: param.name,
        ossFileName: param.ossFileName,
        parentId: param.parentId
      };
      return Api.getInstance.post({ url: BaseUrl + '/oss-file', params, withToken: true });
    };

    const createNewFolder = () => {
      createFolderAPI({ isFolder: true, name: text, parentId: parentId })
        .then(() => {
          let param = {
            current: 1,
            pageSize: 10,
            parentId: parentId
          };
          LessonFolder(param).then((result) => {
            if (result.success) {
              setMoveFolderInfo(result.result);
              setMoveFolderList(result.result.content);
              setModalVisible(false);
            }
          });
        })
        .catch((err) => {
          setModalVisible(false);
          baseView.current.showMessage({ text: err, delay: 2 });
        });
    };

    const createNewFile = () => {
      return (
        <Portal>
          <Modal visible={modalVisible} dismissable={true} onDismiss={() => setModalVisible(false)} contentContainerStyle={[tw.flexRow]}>
            <View style={[tw.flex1, tw.roundedLg, tw.mX10, { backgroundColor: colors.surface }]}>
              <View style={[tw.p3]}>
                <Text style={[tw.fontLight, tw.selfCenter, { fontSize: 16, fontWeight: 'bold' }]}>新建文件夹</Text>
                <TextInput
                  placeholder="新建文件夹"
                  style={[tw.mT3, tw.mX3, tw.bgGray200, tw.borderGray200, { height: 40, borderWidth: 0.5, borderRadius: 5 }]}
                  value={text}
                  onChangeText={(e) => {
                    setText(e);
                  }}
                />
              </View>

              <View style={[tw.mT6, tw.mX1, tw.flexRow, tw.borderGray300, { borderTopWidth: 0.5, height: 50 }]}>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.placeholder }]}>取消</Text>
                </TouchableOpacity>
                <Text style={[tw.selfCenter, tw.textGray300, { fontSize: 18 }]}>|</Text>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={async () => {
                    await createNewFolder();
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.accent }]}>创建</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const moveFolder = () => {
      if (parentId) {
        if (cloudSeaDiskStore.selects.length === 1) {
          cloudSeaDiskStore
            .moveOneFolder({ id: cloudSeaDiskStore.selects[0], parentId: folderListAll.length > 0 ? folderListAll[folderListAll.length - 1].id : '0' })
            .then((res) => {
              if (typeof res === 'boolean') {
                cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((result) => {
                  if (typeof result === 'boolean') {
                    baseView.current.showMessage({ text: '修改成功', delay: 2 });
                  } else {
                    baseView.current.showMessage({ text: result, delay: 3 });
                  }
                });
                navigation.goBack();
              } else {
                baseView.current.showMessage({ text: res, delay: 3 });
              }
            });
        } else {
          cloudSeaDiskStore
            .moveMoreFolder({ ids: cloudSeaDiskStore.selects, parentId: folderListAll.length > 0 ? folderListAll[folderListAll.length - 1].id : '0' })
            .then((res) => {
              if (typeof res !== 'string') {
                if (res.successCount > 0 && res.failCount === 0) {
                  cloudSeaDiskStore.accessToPublicResources({ current: 1, parentId: cloudSeaDiskStore.parentId }).then((result) => {
                    if (typeof result === 'boolean') {
                      baseView.current.showMessage({ text: '修改成功', delay: 2 });
                    } else {
                      baseView.current.showMessage({ text: result, delay: 3 });
                    }
                  });
                  setShowMoveModal(false);
                  navigation.goBack();
                } else {
                  baseView.current.showMessage({ text: '成功移动' + res.successCount + '个文件', delay: 2 });
                }
              } else {
                baseView.current.showMessage({ text: res, delay: 3 });
              }
            });
        }
      }
      setShowMoveModal(false);
    };

    const renderMenuSheetOut = () => {
      menuMoreSheet.current.snapTo(0);
    };

    const moveFolderModal = () => {
      return (
        <Portal>
          <Modal visible={showMoveModal} dismissable={true} onDismiss={() => setShowMoveModal(false)} contentContainerStyle={[tw.flexRow]}>
            <View style={[tw.flex1, tw.roundedLg, tw.mX10, { backgroundColor: colors.surface }]}>
              <View style={[tw.p3]}>
                <Text style={[tw.fontLight, tw.selfCenter, { fontSize: 16, fontWeight: 'bold' }]}>移动文件夹</Text>
                <View style={[tw.flexRow, tw.flexGrow, { flexWrap: 'wrap' }]}>
                  <Text>将</Text>
                  {cloudSeaDiskStore.selects?.map((id, index) => (
                    <Text style={[{ color: colors.accent }]} key={index}>
                      《
                      {cloudSeaDiskStore.allResourcesList.filter((item) => item.id === id).length > 0
                        ? cloudSeaDiskStore.allResourcesList.filter((item) => item.id === id)[0].name
                        : null}
                      》
                    </Text>
                  ))}
                  <Text>移入</Text>
                  <Text style={[{ color: colors.accent }]}>《{folderListAll.length > 0 ? folderListAll[folderListAll.length - 1].name : '首页'}》</Text>
                </View>
              </View>

              <View style={[tw.mT6, tw.mX1, tw.flexRow, tw.borderGray300, { borderTopWidth: 0.5, height: 50 }]}>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={() => {
                    setShowMoveModal(false);
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.placeholder }]}>取消</Text>
                </TouchableOpacity>
                <Text style={[tw.selfCenter, tw.textGray300, { fontSize: 18 }]}>|</Text>
                <TouchableOpacity
                  style={[tw.flex1, tw.itemsCenter, tw.justifyCenter]}
                  onPress={async () => {
                    await moveFolder();
                  }}
                >
                  <Text style={[{ fontSize: 16, color: colors.accent }]}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
      );
    };

    const getCurrent = (current: number): number => {
      if (current === 0) {
        return 1;
      } else {
        if (current % 10 === 0) {
          return current / 10 + 1;
        } else if (current % 10 < 10) {
          return Math.ceil(current / 10);
        } else {
          return 1;
        }
      }
    };

    let canAdd = true;
    const loadAddData = () => {
      if (canAdd) {
        canAdd = false;
        setTimeout(async () => {
          const param: ResourcesType = {
            current: getCurrent(moveFolderList.length),
            parentId: parentId,
            pageSize: 10
          };
          let result = await LessonFolder(param);
          if (result.success) {
            setMoveFolderInfo(result.result);
            setMoveFolderList(result.result.content);
            setParentId('0');
          }
        }, 200);
      }
    };

    const onRefresh = async () => {
      await setRefreshing(true);
      setTimeout(async () => {
        let param = {
          current: 1,
          parentId: parentId,
          pageSize: 10
        };
        let result = await LessonFolder(param);
        if (result.success) {
          setMoveFolderInfo(result.result);
          setMoveFolderList(result.result.current);
        }
        await setRefreshing(false);
      }, 1500);
    };

    const renderItem = ({ item, index }) => {
      return (
        <View style={[{ borderBottomWidth: 0.5 }, tw.borderGray400]}>
          <DiskFolder
            key={index}
            data={item}
            index={index}
            select={select}
            givePress={(id, name, type) => {
              doEnyThings(id, name, type);
            }}
            useSelect={false}
            changeSelect={(e: string) => {
              if (select.filter((msg) => msg === e).length > 0) {
                let changeIndex = select.indexOf(e);
                select.splice(changeIndex, 1);
                renderMenuSheetOut();
                setSelect([...select]);
              } else {
                setSelect([e, ...select]);
              }
            }}
          />
        </View>
      );
    };

    const renderContent = () => {
      return (
        <View style={[tw.pT5, tw.flex1]}>
          <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter, tw.pB3, tw.pX2]}>
            <Text numberOfLines={2} style={[{ color: colors.placeholder, width: '70%' }]}>
              {t('selectVodPage.cloudFolder')}
              {folderListAll?.map((item) => {
                return `>${item.name}`;
              })}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelect([]);
                if (folderListAll.length > 2) {
                  setParentId(folderListAll[folderListAll.length - 2].id);
                } else {
                  setParentId('0');
                }
                if (folderListAll.length > 0) {
                  setMoveFolderList(folderListAll[folderListAll.length - 1].list);
                }
                folderListAll.pop();
                setFolderListAll([...folderListAll]);
              }}
              style={[tw.flexRow, tw.itemsCenter, tw.justifyCenter]}
            >
              <Icon name="reply" color={colors.notification7} size={18} />
              <Text style={[{ color: colors.notification7 }]}> {t('selectVodPage.return')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            style={[tw.flex1, tw.pX1]}
            scrollEnabled={true}
            data={moveFolderList}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            numColumns={1}
            renderItem={renderItem}
            onEndReached={loadAddData}
            onEndReachedThreshold={0.1}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListFooterComponent={
              <View style={[tw.itemsCenter]}>
                {moveFolderList?.length === 0 ? (
                  <Text style={[tw.mT16, tw.selfCenter, { fontSize: 16, fontWeight: 'bold' }]}>文件夹为空</Text>
                ) : (
                  <Text style={[tw.mY3, { fontSize: 12, color: colors.disabled }]}>云海学悦保障您的数据安全</Text>
                )}
              </View>
            }
          />
          <View style={[tw.bgGray800, tw.flexRow, { width: '100%', height: 55 }]}>
            <Button
              onPress={() => {
                navigation.goBack();
              }}
              labelStyle={[{ color: colors.background }]}
              style={[tw.flex1, tw.mY1, tw.mX3, { height: 38 }, tw.bgGray600]}
            >
              取消
            </Button>
            <Button
              onPress={() => {
                setShowMoveModal(true);
              }}
              labelStyle={[{ color: colors.background }]}
              style={[tw.flex1, tw.mY1, tw.mX3, { height: 38, backgroundColor: colors.accent }]}
            >
              移动
            </Button>
          </View>
        </View>
      );
    };

    return (
      <BaseView useSafeArea={false} scroll={false} ref={baseView} style={[tw.flex1]}>
        <Appbar.Header style={[tw.justifyCenter, tw.mX3, { backgroundColor: colors.background }]}>
          <Text style={[{ fontSize: 17, fontWeight: 'bold', color: colors.text }]}>选择移动位置</Text>
          <Text
            style={[tw.absolute, { right: 0, fontSize: 12, color: colors.text }]}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            新建文件夹
          </Text>
        </Appbar.Header>
        {renderContent()}
        {createNewFile()}
        {moveFolderModal()}
      </BaseView>
    );
  }
);
