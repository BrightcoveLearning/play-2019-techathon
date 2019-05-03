import fetch from 'cross-fetch';

export default function makeApiCall(url, method) {
  // This will not be accessible past the workshop date
  const oAuthProxyUrl = 'http://play-oauth-proxy.applications.us-east-1.prod.deploys.brightcove.com/api/defaultCreds';
  const options = {
    method: 'POST',
    body: JSON.stringify({
      apiCall: url,
      method
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return fetch(oAuthProxyUrl, options).then(
    response => response.json(),

    // Do not use catch, because that will also catch
    // any errors in the dispatch and resulting render,
    // causing a loop of 'Unexpected batch number' errors.
    // https://github.com/facebook/react/issues/6895
    error => console.error('ERROR', error),
  );
}
