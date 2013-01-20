##===========================================================================
##===========================================================================
##
## Import the location of food chains and export the data as CSV and geojson
##
## Note:
##  Dunkin Donuts - data includes Canada
##  Pizza Hut     - data includes Canada
##
## Date: 18.01.2013
##
##===========================================================================
##===========================================================================

library(rgdal)
library(ggplot2)

options(stringsAsFactors = FALSE) 

setwd("E:/Privat/pjgithub/dataexpedition/patrick-hausmann")

Read_Data <- function(m) {
    k <- list()
    for (i in seq_along(m)) {
        xfile  <- paste(m[i], ".csv", sep="")
        k[[i]] <- read.csv(file.path("Raw Data", xfile))
        k[[i]]$firm <- m[i]
    }
    names(k) <- m
    return(k)
}

Plot_Density <- function(x, xvar) {
    m <- ggplot(x, aes_string(x=xvar, colour="firm", group="firm"))
    m + geom_density(fill=NA, size=1) + theme_bw()
}

Check_if_File_exists <- function(x) {
    outfile <- file.path("data", paste(names(x), ".geojson", sep=""))
     for (i in seq_along(outfile)) {
        if (file.exists(outfile[i])) {
            file.remove(outfile[i])
        }
    }
}

Write_GeoJSON <- function(x) {
	# write data as geojson	
	xfile <- paste(unique(x$firm), ".geojson", sep="")
	outfile <- file.path("data", xfile)
	coordinates(x) <- c("longitude", "latitude")
	writeOGR(x, outfile, "x", driver="GeoJSON")
}

###################################################################

m <- c("starbucks", "dunkin_donuts", "kfc", "mcdonalds", 
		   "pizza_hut", "taco_bell")

k <- Read_Data(m)

lapply(k, names)

lapply(k, head)

# Columnnames  "longitude" and "latitude" are interchanged
names(k$starbucks)[which(names(k$starbucks) == "lat")] <- "longitude"
names(k$starbucks)[which(names(k$starbucks) == "long")] <- "latitude"

all.equal(k$mcdonalds[, "Longitude"],k$mcdonalds[, "longitude"])
all.equal(k$mcdonalds[, "Latitude"], k$mcdonalds[, "latitude"])

x <- do.call(rbind, lapply(k, FUN=function(L) 
	               L[, c("firm", "longitude", "latitude")]))

x$collected <- -99
x[x$firm == "starbucks", "collected"] <- 2008
x[x$firm == "dunkin_donuts", "collected"] <- 2009
x[x$firm == "kfc", "collected"]           <- 2011
x[x$firm == "mcdonalds", "collected"]     <- 2007
x[x$firm == "pizza_hut", "collected"]     <- 2011
x[x$firm == "taco_bell", "collected"]     <- 2011

rownames(x) <- NULL

str(x)

x[(x$longitude == 0 | (x$latitude) == 0),]
x <- x[!(x$longitude == 0 | (x$latitude) == 0),]

table(x$firm)
tapply(x$latitude, x$firm, fivenum)
tapply(x$longitude, x$firm, fivenum)

pdf("graphics/Density_lon_lat.pdf", width=11.69, height=8.27)
    Plot_Density(x, "longitude")
    Plot_Density(x, "latitude")
dev.off()

pdf("graphics/Density_map.pdf", width=11.69, height=8.27)
    x1 <- transform(x, long = round(longitude, 2), lat = round(latitude, 2))
    p1 <- ggplot(x1, aes (x=long, y=lat, fill = firm)) + theme_bw()
    p1 <- p1 + stat_binhex (bins=50, aes (alpha = ..count..))
    p2 <- p1 + facet_wrap(~ firm)
    print(p1)
    print(p2)
    rm(x1, p1, p2)
dev.off()

xs <- split(x, x$firm)

Check_if_File_exists(xs)

lapply(xs, Write_GeoJSON)

# write data as CSV
write.csv(x, file.path("data", "fastfood.csv"))

# save data 
save(k, x, file=file.path("data", "fastfood.rdata"))

#
# FINI
#

