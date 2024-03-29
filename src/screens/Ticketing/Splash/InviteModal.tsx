import React, {forwardRef, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import analytics from '@react-native-firebase/analytics';
import {enrollIntoBetaGroups} from '../../../api/enrollment';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '../../../components/button';
import {Confirm} from '../../../assets/svg/icons/actions';
import {StyleSheet} from '../../../theme';
import ThemeText from '../../../components/text';
import MessageBox from '../../../message-box';
import composeRefs from '@seznam/compose-react-refs';
import {TextInput} from '../../../components/sections';

type Props = {
  onEnrolled(): void;
};

export default forwardRef<Modalize, Props>(function InviteModal(
  {onEnrolled},
  ref,
) {
  const styles = useStyles();
  const [inviteKey, setInviteKey] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {bottom: paddingBottom} = useSafeAreaInsets();
  const modalRef = useRef<Modalize>(null);
  const combinedRef = composeRefs<Modalize>(ref, modalRef);

  async function onTicketEnrollment() {
    setHasError(false);
    setIsLoading(true);
    try {
      const {data: enrollment} = await enrollIntoBetaGroups(inviteKey);
      if (enrollment && enrollment.status === 'ok') {
        await analytics().setUserProperty(
          'beta_group',
          enrollment.groups.join(','),
        );
        modalRef.current?.close();
        onEnrolled();
      }
    } catch (err) {
      console.warn(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Portal>
      <Modalize
        ref={combinedRef}
        adjustToContentHeight={true}
        tapGestureEnabled={false}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
        }}
      >
        <View style={[styles.container, {paddingBottom}]}>
          {isLoading ? (
            <ActivityIndicator style={styles.loading} />
          ) : (
            <>
              <ThemeText type="paragraphHeadline" style={styles.title}>
                Registrer deg som testpilot for billettkjøp
              </ThemeText>
              <ThemeText type="body" style={styles.text}>
                Send oss invitasjonskoden din og bli først ute med å teste
                billettkjøp direkte fra reiseappen.
              </ThemeText>
              <View style={styles.input}>
                <TextInput
                  radius="top-bottom"
                  label="Kode"
                  value={inviteKey}
                  onChangeText={setInviteKey}
                  autoCapitalize="none"
                />
              </View>
              {hasError && (
                <MessageBox
                  type="warning"
                  message="Du har sendt en ugyldig invitasjonskode. Prøv igjen, eller kontakt oss i appchat dersom den ikke fungerer."
                  containerStyle={styles.messageBox}
                />
              )}
            </>
          )}
          <Button
            onPress={onTicketEnrollment}
            text="Send inn kode"
            icon={Confirm}
            disabled={isLoading || !inviteKey}
            style={styles.button}
          />
        </View>
      </Modalize>
    </Portal>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level3,
    paddingVertical: theme.spacings.large,
    paddingHorizontal: theme.spacings.medium,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacings.medium,
  },
  text: {
    marginBottom: theme.spacings.medium,
  },
  input: {
    marginBottom: theme.spacings.medium,
  },
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  loading: {
    marginBottom: theme.spacings.medium,
  },
  button: {
    marginBottom: theme.spacings.small,
  },
}));

async function handleEnrollIntoGroup(inviteKey: string) {}
