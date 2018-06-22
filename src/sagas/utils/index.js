import nanoid from 'nanoid';
import { eventChannel } from 'redux-saga';
import { take, fork, put, call, takeEvery } from 'redux-saga/effects';

import { toggleLoading } from '../../actions';

export const generateLoadingId = sagaName => `${sagaName}${nanoid()}`;

export function* closeChannelOnEvent(channel, stopEvent) {
  yield take(stopEvent);
  channel.close();
}

export function* initChannelWithFirstLoad(name, stopEvent, handleEvent, defineChannel) {
  const channel = eventChannel(defineChannel);

  yield fork(closeChannelOnEvent, channel, stopEvent);

  const loadingId = generateLoadingId(`${name}.firstLoad`);
  try {
    yield put(toggleLoading(true, loadingId));
    const action = yield take(channel);
    yield call(handleEvent, action);
  } finally {
    yield put(toggleLoading(false, loadingId));
  }

  yield takeEvery(channel, handleEvent);
}
