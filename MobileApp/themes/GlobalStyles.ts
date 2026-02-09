import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: "center",
        margin: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 24,
    },
    cardContainer: {
        alignContent: 'flex-start',
        marginBlockStart: 20,
        width: '100%',
        backgroundColor: 'lightgrey',
        marginBlockEnd: 10
    },
    container: {
        padding: 16,
        gap: 16,
        width: "100%",
    },
    card: {
        width: "100%",
    },
    cardContent: {
        gap: 12,
    },
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subHeading: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16
    },
    basicInfoView: {
        margin: 2,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
    },
    descriptionView: {
        width: "95%",
        margin: 8,
    },
    pressableView: {
        flexDirection: "row",
        gap: 32,
    },
    singleEventView: {
        marginTop: 8,
        width: '100%'
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#ddd',
        width: '100%'
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    button: {
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
        backgroundColor: 'lightblue',
        width: 'auto',
        padding: 10,
    },
    buttonText: {
        fontWeight: "bold",
        alignItems: "center",
        padding: 12,
        marginVertical: 10,
        borderRadius: 10,
        fontSize: 16
    },
    addButton: {
        backgroundColor: "green",
        alignItems: "center",
        padding: 12,
        borderRadius: 5,
        margin: 10,
    },
    textPressed: {
        opacity: 0.6,
    },
    infoText: {
        fontSize: 16,
        padding: 5,
    },
    helperText: {
        color: "#666",
        fontSize: 12,
    },
    noEventsText: {
        fontSize: 16,
        fontStyle: 'italic'
    },
    filtersView: {
        flex: 1,
        width: '95%',
        justifyContent: 'space-evenly',
        margin: 8
    },
    mapContainer: {
        margin: 8,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxHeight: 300
    },
    label: {
        fontWeight: "600",
    },
    divider: {
        color: '#fff',
        width: '100%',
    }
})

export default globalStyles