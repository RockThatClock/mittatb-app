import {useNavigation} from '@react-navigation/native';
import React from 'react';
import SvgClose from '../../assets/svg/icons/actions/Close';
import {ArrowLeft} from '../../assets/svg/icons/navigation';
import ThemeIcon from '../../components/theme-icon';
import ScreenHeader from '../../ScreenHeader';
import {useTranslation, ProfileTexts} from '../../translations/';

type BackHeaderProps = {
  title: string;
  closeIcon?: boolean;
};
export default function BackHeader({
  title,
  closeIcon = false,
}: BackHeaderProps) {
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  const {t} = useTranslation();

  return (
    <ScreenHeader
      leftButton={{
        onPress: goBack,
        icon: <ThemeIcon svg={closeIcon ? SvgClose : ArrowLeft} />,
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: t(ProfileTexts.header.backButton.a11yLabel),
      }}
      title={title}
    />
  );
}
