const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const axios = require("axios")

const FLICKR_API_ENDPOINT = "https://www.flickr.com/services/rest/"
const FLICKR_API_KEY = "02aea10bf5e87b6a01c470a651fb629f"
const FLICKR_PHOTOSET_ID = "72157709249956352"
const FLICKR_PHOTOSET_METHOD = "flickr.photosets.getPhotos"
const FLICKR_PHOTO_EXIF_METHOD = "flickr.photos.getExif"
const FLICKR_PHOTO_SIZES_METHOD = "flickr.photos.getSizes"
const FLICKR_PHOTO_INFO_METHOD = "flickr.photos.getInfo"

const getFlickrPhotoset = () => {
  return axios.get(
    `${FLICKR_API_ENDPOINT}?method=${FLICKR_PHOTOSET_METHOD}&api_key=${FLICKR_API_KEY}&photoset_id=${FLICKR_PHOTOSET_ID}&format=json&nojsoncallback=1`
  )
}

const getFlickrPhotoExif = id => {
  return axios.get(
    `${FLICKR_API_ENDPOINT}?method=${FLICKR_PHOTO_EXIF_METHOD}&api_key=${FLICKR_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`
  )
}

const getFlickrPhotoSizes = id => {
  return axios.get(
    `${FLICKR_API_ENDPOINT}?method=${FLICKR_PHOTO_SIZES_METHOD}&api_key=${FLICKR_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`
  )
}

const getFlickrPhotoInfo = id => {
  return axios.get(
    `${FLICKR_API_ENDPOINT}?method=${FLICKR_PHOTO_INFO_METHOD}&api_key=${FLICKR_API_KEY}&photo_id=${id}&format=json&nojsoncallback=1`
  )
}

exports.sourceNodes = async ({ actions, store, cache, createNodeId }) => {
  const { createNode, createNodeField } = actions
  // Fetch data
  const { data } = await getFlickrPhotoset()

  // use for loop for async/await support
  for (const image of data.photoset.photo) {
    const {
      data: {
        sizes: { size: dataPhotoSizes },
      },
    } = await getFlickrPhotoSizes(image.id)
    const largeSize = dataPhotoSizes.find(size => size.label === "Large 2048")

    const {
      data: { photo: dataPhotoExif },
    } = await getFlickrPhotoExif(image.id)

    const createdDate = dataPhotoExif.exif.find(
      exif => exif.tag === "CreateDate"
    )

    // const { data } = await getFlickrPhotoInfo(image.id)

    const {
      data: {
        photo: {
          dates: { taken },
        },
      },
    } = await getFlickrPhotoInfo(image.id)

    console.log("###data", taken)

    let fileNode
    try {
      fileNode = await createRemoteFileNode({
        url: largeSize.source,
        cache,
        store,
        createNode,
        createNodeId,
      })
      // TODO: add additional fields
      await createNodeField({
        node: fileNode,
        name: "FlikrImage",
        value: "true",
      })
      await createNodeField({
        node: fileNode,
        name: "name",
        value: image.name,
      })
      await createNodeField({
        node: fileNode,
        name: "camera",
        value: dataPhotoExif.camera,
      })
      await createNodeField({
        node: fileNode,
        name: "taken",
        value: taken,
      })
      await createNodeField({
        node: fileNode,
        name: "title",
        value: image.title,
      })
    } catch (error) {
      console.warn("error creating node", error)
    }
  }
}
