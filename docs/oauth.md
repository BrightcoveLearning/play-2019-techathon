# OAuth and API Access

In order to access Brightcove APIs, you must authenticate with Brightcove's [OAuth API][oauth-api] for access. There are several ways to do this, but for client-side application access the [Client credential flow][cred-flow] is recommended. Most APIs will return a temporary OAuth2 access token which can then be used to make requests against other Brightcove APIs.

## Normal Workflow

Normally, you would need to write a service that [requests access tokens][get-access-token] with the [Client Registration][client-reg] of your application and then make API calls.

## Project Workflow

For the Tech-A-Thon, we have setup an OAuth proxy to save time and focus on the usage of the APIs themselves. This proxy is setup to use a specific Video Cloud account that has the proxy's client registration.

**NOTE**: This proxy will be shutdown after the Tech-A-Thon and is not intended to be used outside of this workshop.

### Usage of OAuth Proxy

endpoint: `http://play-oauth-proxy.applications.us-east-1.prod.deploys.brightcove.com/api/defaultCreds`
method: `POST`

The OAuth proxy will make the actual calls to Brightcove APIs on your behalf after authenticating and receiving an access token.

### Calling Interface

```json
  {
    "apiCall": <api endpoint>,
    "method": <method to call on api endpoint>,
    "apiCallData": <optional json string of data to send to api endpoint>
  }
```

The supported methods are `GET, POST, PUT, PATCH`. `DELETE` is not implemented.

### Examples

A GET request could look like this:

```bash
curl -X POST \
  http://play-oauth-proxy.applications.us-east-1.prod.deploys.brightcove.com/api/defaultCreds \
  -H 'Content-Type: application/json' \
  -d '{
	"apiCall": "https://cms.api.brightcove.com/v1/accounts/<accountId>/videos",
	"method": "GET"
  }'
```

A POST request could look like this:

```bash
curl -X POST \
  http://play-oauth-proxy.applications.us-east-1.prod.deploys.brightcove.com/api/defaultCreds \
  -H 'Content-Type: application/json' \
  -d '{
    "apiCall": "https://cms.api.brightcove.com/v1/accounts/<accountId>/videos",
    "method": "POST",
    "apiCallData": {
    	"name": "test video post"
    }
  }'
```

You can also pass in your own clientId and clientSecret to the OAuth proxy by adding them to the request payload. This option should be used at your own risk as we cannot test your credentials in advance.

```bash
curl -X POST \
  http://play-oauth-proxy.applications.us-east-1.prod.deploys.brightcove.com/api/defaultCreds \
  -H 'Content-Type: application/json' \
  -d '{
	"apiCall": "https://cms.api.brightcove.com/v1/accounts/<accountId>/videos",
	"method": "GET",
  "clientId": <your clientId>,
  "clientSecret": <you clientSecret>
  }'
```

## References

- [OAuth API][oauth-api]
- [OAuth API Reference][api-ref]
- [Client Credential Flow][cred-flow]
- [Getting Access Tokens][get-access-token]
- [Managing API Authentication Credentials][client-reg]
- [Quick Start: OAuth][oauth-quick]
- [API Operations for Client Credentials Requests][api-ops]
- [OAuth API Sample: Get an Access Token][oauth-sample]

[oauth-api]: https://support.brightcove.com/overview-oauth-api-v4
[api-ref]: https://docs.brightcove.com/oauth-api/v4/doc/index.html
[cred-flow]: https://support.brightcove.com/overview-oauth-api-v4#Client_credential_flow
[get-access-token]: https://support.brightcove.com/getting-access-tokens
[client-reg]: https://support.brightcove.com/managing-api-authentication-credentials
[oauth-quick]: https://support.brightcove.com/quick-start-oauth
[api-ops]: https://support.brightcove.com/api-operations-client-credentials-requests
[oauth-sample]: https://support.brightcove.com/oauth-api-sample-get-access-token
