import { ListObjectsCommand } from '@aws-sdk/client-s3'

const video = require('../transform/video.js')

const s3cfg = require('./s3client.js')

const VIDEO_EXTS = ['mp4', 'm4v', 'avi', 'mov', 'webm', 'mkv', 'flv', '3gp']

function isVideo (path) {
  if (path.endsWith('/')) {
    return false
  }
  const dotPos = path.lastIndexOf('.')
  const ext = dotPos === -1 ? '' : path.substring(dotPos + 1)
  return VIDEO_EXTS.includes(ext.toLowerCase())
}

async function listSource (prefix) {
  return await listObjects(prefix, s3cfg.sourceClient, s3cfg.sourceBucketParams, true)
}

async function listDest (prefix) {
  return await listObjects(prefix, s3cfg.destClient, s3cfg.destBucketParams, false)
}

async function listObjects (prefix, client, params, isSource) {
  // Declare truncated as a flag that the while loop is based on.
  let truncated = true

  const fullPrefix = params.Prefix + prefix
  const bucketParams = Object.assign({}, params, { Prefix: fullPrefix, Delimiter: '/' })
  const objects = []
  console.log('listing with prefix = ' + prefix + ', fullPrefix = ' + fullPrefix)

  // Declare a variable to which the key of the last element is assigned to in the response.
  let pageMarker

  // while loop that runs until 'response.truncated' is false.
  while (truncated) {
    try {
      const response = await client.send(new ListObjectsCommand(bucketParams))
      if (typeof response.Contents !== 'undefined') {
        response.Contents.forEach((item) => {
          if (isSource && isVideo(item.Key)) {
            objects.push({ name: item.Key, type: 'file', video: true })
          } else {
            objects.push({ name: item.Key, type: item.Key.endsWith('/') ? 'dir' : 'file' })
          }
        })
      }
      if (typeof response.CommonPrefixes !== 'undefined') {
        response.CommonPrefixes.forEach((item) => {
          objects.push({ name: item.Prefix, type: 'dir' })
        })
      }
      // Log the key of every item in the response to standard output.
      truncated = response.IsTruncated
      // If truncated is true, assign the key of the last element in the response to the pageMarker variable.
      if (truncated) {
        pageMarker = response.Contents.slice(-1)[0].Key
        // Assign the pageMarker value to bucketParams so that the next iteration starts from the new pageMarker.
        bucketParams.Marker = pageMarker
      }
      // At end of the list, response.truncated is false, and the function exits the while loop.
    } catch (err) {
      console.log('Error', err)
      truncated = false
    }
  }
  return objects
}

export default {
  path: '/s3/list',
  async handler (req, res) {
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    console.log('>>>>> API: Listing ' + req.url + ', prefix = ' + prefix)
    const results = await listSource(prefix)
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.video) {
        result.meta = await video.transformer.transform(result.name)
      }
    }
    res.end(JSON.stringify(results, null, 2))
  }
}
