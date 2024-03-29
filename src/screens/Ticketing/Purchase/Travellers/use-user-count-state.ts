import {useCallback, useReducer} from 'react';
import {useRemoteConfig} from '../../../../RemoteConfigContext';
import {UserProfile} from '../../../../reference-data/types';

export type UserProfileWithCount = UserProfile & {count: number};
type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
};

type CountReducerAction =
  | {type: 'INCREMENT_COUNT'; userType: string}
  | {type: 'DECREMENT_COUNT'; userType: string};

type CountReducer = (
  prevState: UserCountState,
  action: CountReducerAction,
) => UserCountState;

const countReducer: CountReducer = (prevState, action): UserCountState => {
  switch (action.type) {
    case 'INCREMENT_COUNT': {
      return {
        ...prevState,
        userProfilesWithCount: prevState.userProfilesWithCount.map(
          (userProfile) =>
            userProfile.userTypeString === action.userType
              ? {...userProfile, count: userProfile.count + 1}
              : userProfile,
        ),
      };
    }
    case 'DECREMENT_COUNT': {
      const existingCount =
        prevState.userProfilesWithCount.find(
          (u) => u.userTypeString === action.userType,
        )?.count || 0;
      if (existingCount == 0) {
        return prevState;
      }

      return {
        ...prevState,
        userProfilesWithCount: prevState.userProfilesWithCount.map(
          (userProfile) =>
            userProfile.userTypeString === action.userType
              ? {...userProfile, count: userProfile.count - 1}
              : userProfile,
        ),
      };
    }
  }
};

const createInitialState = (userProfiles: UserProfile[]) => ({
  userProfilesWithCount: userProfiles.map((u) => ({
    ...u,
    count: 0,
  })),
});

export default function useUserCountState() {
  const {user_profiles: userProfiles} = useRemoteConfig();
  const [userCountState, dispatch] = useReducer(
    countReducer,
    userProfiles,
    createInitialState,
  );

  const addCount = useCallback(
    (userType: string) => dispatch({type: 'INCREMENT_COUNT', userType}),
    [dispatch],
  );
  const removeCount = useCallback(
    (userType: string) => dispatch({type: 'DECREMENT_COUNT', userType}),
    [dispatch],
  );

  return {
    ...userCountState,
    addCount,
    removeCount,
  };
}
