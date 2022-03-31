const replace = (arg: string, data: Record<string, string | Record<string, string>>): string => (data && data[arg] || '').toString()
const replaceTmx = (arg: string, data: Record<string, string | Record<string, string>>): string => {
    const a = arg.replace('tmx.', '')
    if (data && data.tmx && typeof data.tmx === 'object' && data.tmx[a]) {
        return data.tmx[a].toString()
    }
    return ''
}
const tmxLink = (arg: string, data: Record<string, string | Record<string, string>>): string => {
    if (data && data['tmx'] && typeof data.tmx === 'object' && data.tmx.TrackID) {
        return `https://trackmania.exchange/maps/${data.tmx.TrackID}`
    }
    return ''
}

const params: { [key: string]: (arg: string, data: Record<string, string | Record<string, string>>) => string } = {
    'mapName': replace,
    'mapAuthor': replace,
    'mapUid': replace,
    'mapAuthorTime': replace,
    'mapGoldTime': replace,
    'mapSilverTime': replace,
    'mapBronzeTime': replace,
    'tmxLink': tmxLink,
    'tmx.TrackID': replaceTmx,
    'tmx.UserID': replaceTmx,
    'tmx.Username': replaceTmx,
    'tmx.GbxMapName': replaceTmx,
    'tmx.AuthorLogin': replaceTmx,
    'tmx.MapType': replaceTmx,
    'tmx.TitlePack': replaceTmx,
    'tmx.TrackUID': replaceTmx,
    'tmx.Mood': replaceTmx,
    'tmx.DisplayCost': replaceTmx,
    'tmx.ModName': replaceTmx,
    'tmx.Lightmap': replaceTmx,
    'tmx.ExeVersion': replaceTmx,
    'tmx.ExeBuild': replaceTmx,
    'tmx.AuthorTime': replaceTmx,
    'tmx.ParserVersion': replaceTmx,
    'tmx.UploadedAt': replaceTmx,
    'tmx.UpdatedAt': replaceTmx,
    'tmx.Name': replaceTmx,
    'tmx.Tags': replaceTmx,
    'tmx.TypeName': replaceTmx,
    'tmx.StyleName': replaceTmx,
    'tmx.EnvironmentName': replaceTmx,
    'tmx.VehicleName': replaceTmx,
    'tmx.UnlimiterRequired': replaceTmx,
    'tmx.RouteName': replaceTmx,
    'tmx.LengthName': replaceTmx,
    'tmx.DifficultyName': replaceTmx,
    'tmx.Laps': replaceTmx,
    'tmx.ReplayWRID': replaceTmx,
    'tmx.ReplayWRTime': replaceTmx,
    'tmx.ReplayWRUserID': replaceTmx,
    'tmx.ReplayWRUsername': replaceTmx,
    'tmx.TrackValue': replaceTmx,
    'tmx.Comments': replaceTmx,
    'tmx.MappackID': replaceTmx,
    'tmx.Unlisted': replaceTmx,
    'tmx.Unreleased': replaceTmx,
    'tmx.Downloadable': replaceTmx,
    'tmx.RatingVoteCount': replaceTmx,
    'tmx.RatingVoteAverage': replaceTmx,
    'tmx.HasScreenshot': replaceTmx,
    'tmx.HasThumbnail': replaceTmx,
    'tmx.HasGhostBlocks': replaceTmx,
    'tmx.EmbeddedObjectsCount': replaceTmx,
    'tmx.EmbeddedItemsSize': replaceTmx,
    'tmx.IsMP4': replaceTmx,
    'tmx.SizeWarning': replaceTmx,
    'tmx.AwardCount': replaceTmx,
    'tmx.CommentCount': replaceTmx,
    'tmx.ReplayCount': replaceTmx,
    'tmx.ImageCount': replaceTmx,
    'tmx.VideoCount': replaceTmx,
}

export const textParse = (inputString: string, inputData: Record<string, string | Record<string, string>>): string => {
    let out = inputString
    console.log(inputData)
    Object.keys(params).forEach(p => {
        out = out.replace(`{${p}}`, params[p](p, inputData))
    })

    return out || ' '
}
