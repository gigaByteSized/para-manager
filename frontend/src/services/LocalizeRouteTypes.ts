import * as schemas from "../schemas";

export const LocalizeRouteTypes = (restrictions) => {
    var localizedRoutes = {}
    for(let i = 0; i < restrictions.length; i++) {
        localizedRoutes[restrictions[i]] = schemas.routeTypes[restrictions[i]];
    }

    return localizedRoutes;
}