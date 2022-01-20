import * as yt from 'youtube-search-without-api-key';

// /**
//  * Given a search query, searching on youtube
//  * @param {string} search value (string or videoId).
//  */
const videos = async (req,res)=>{ 
    // console.log(req.body)
    try {
        // console.log(req.body.data)
        let videoList = await yt.search(req.body.word);
        res.json({videoList});
    }
    catch {
        console.log('error');
    }
}

export default videos;