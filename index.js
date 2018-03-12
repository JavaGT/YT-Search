// Dependencies
let htmlparser = require('fast-html-parser')
let request = require('request-promise')

// QuerySelectors for web scraping search interface
const selectors = {
  responseContainers: '.yt-lockup.yt-lockup-tile.yt-lockup-video.clearfix',
  titleLink: '.yt-uix-sessionlink.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.spf-link',
  channelLink: '.yt-lockup-byline',
  thumbnailImg: 'img',
  time: '.video-time',
  meta: '.yt-lockup-meta-info',
  verified: '.yt-uix-tooltip.yt-channel-title-icon-verified.yt-sprite',
  description: '.yt-lockup-description'
}

let queryToURL = query => `https://www.youtube.com/results?search_query=${query.replace(/\s/g, '+')}`

let responseContainerIsntAdvert = container => !container.classNames.includes('yt-uix-tile')

let responseContainerToData = container => {
  let titleLinkElement = container.querySelector(selectors.titleLink)
  let channelLinkElement = container.querySelector(selectors.channelLink).childNodes[0]
  let thumbnailImgElement = container.querySelector(selectors.thumbnailImg)
  let timeElement = container.querySelector(selectors.time)
  let metaElement = container.querySelector(selectors.meta)
  let verifiedElement = container.querySelector(selectors.verified)
  return {
    title: titleLinkElement.rawText.replace(/\s&amp;/g, '').replace(/&#39;/g, '').replace(/&quot;/g, '"'),
    id: titleLinkElement.attributes.href.replace('/watch?v=', ''),
    channel: channelLinkElement.rawText.replace(/\s&amp;/g, ''),
    thumbnail_url: thumbnailImgElement.attributes['data-thumb'] || thumbnailImgElement.attributes['src'],
    length: timeElement.rawText,
    uploaded_est: metaElement.firstChild.rawText,
    views: parseInt(metaElement.lastChild.rawText.replace(/,/g, '')),
    channel_verified: !!verifiedElement
  }
}

let searchYoutube = query => request(queryToURL(query))
  .then(htmlparser.parse)
  .then(root => root.querySelectorAll(selectors.responseContainers))
  .then(responseContainers => responseContainers.filter(responseContainerIsntAdvert))
  .then(responseContainers => responseContainers.map(responseContainerToData))

// Yay export the function!
module.exports = searchYoutube