import { eventChannel } from 'redux-saga';
import { takeEvery, put, take, call, apply, fork, all } from 'redux-saga/effects';

import createSendListChannel from './sendListEventChannel';
import createSendSummaryChannel, { sendSummaryFirstLoad } from './sendSummaryEventChannel';
import { generateLoadingId } from '../utils';
import { toggleLoading, showError } from '../../actions';
import { auth } from '../../firebase';


export const authEventChannel = () => (
  eventChannel(emit => (
    auth.onAuthStateChanged((user) => {
      if (user) {
        emit(user);
      } else {
        emit(false);
      }
    })
  ))
);

function* takeOne(channel, handler) {
  const action = yield take(channel);
  yield call(handler, action);
}

function* stopAll(subChannels) {
  yield all(subChannels.map(c => call(c.stop)));
}

function* startWatching(channels) {
  // Show loading progress during first load
  const loadingId = generateLoadingId('authStates');
  yield put(toggleLoading(true, loadingId));
  try {
    yield all(channels.map(c => call(takeOne, c.channel, c.handleEvent)));
  } catch (error) {
    yield put(showError('Le chargement des blocs a échoué, réessayer'));
    yield apply(auth, 'signOut');
  } finally {
    yield put(toggleLoading(false, loadingId));
  }

  // Then catch subsequent updates of snapshots as they happen
  yield all(channels.map(c => takeEvery(c.channel, c.handleEvent)));
}

function* createOrReplaceSubChannels(user, subChannels) {
  if (subChannels.length > 0) yield call(stopAll, subChannels);
  return [createSendListChannel(user), createSendSummaryChannel()];
}

export default function* handleAuthEventChannel() {
  const channel = authEventChannel();
  let subChannels = [];

  while (true) {
    const user = yield take(channel);
    if (user) {
      subChannels = yield call(createOrReplaceSubChannels, user, subChannels);
      yield fork(startWatching, subChannels);
    } else if (subChannels.length > 0) {
      yield call(stopAll, subChannels);
      subChannels = [];
    } else {
      yield call(sendSummaryFirstLoad);
    }
  }
}
