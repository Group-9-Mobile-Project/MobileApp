import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

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
    container: {
        flex: 1,
    },
    editUserContainer: {
        flex: 1,
        padding: 20,
        marginTop: 20,
        gap: 5,
    },
    showUserContainer: {
        flex: 1,
        paddingVertical: 10,
        marginTop: 20,
        backgroundColor: 'lightgrey'
    },
    contentContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
    },
    cardContainer: {
        alignContent: 'flex-start',
        marginBlockStart: 20,
        width: '100%',
        backgroundColor: Colors.light.background,
        marginBlockEnd: 10
    },
    EventFormContainer: {
        padding: 16,
        gap: 16,
        width: "100%",
    },
    locationContainer: {
        gap: 8,
    },
    recentViewContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
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
        padding: 5
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
    },
    logOutButton: {
        backgroundColor: 'grey',
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        margin: 10,
    },
    logOutButtonText: {
        fontSize: 16,
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
    map: {
        width: "100%",
        height: 220,
        borderRadius: 12,
    },
    mapAllEvents: {
        width: '100%',
        height: '100%',
        margin: 8
    },
    callout: {
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        width: '100%',
        height: '100%',
        position: 'relative'
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
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
    },
    organizerLink: {
        fontSize: 16,
        padding: 5,
        color: "#1e88e5"
    },
    linkText: {
        color: "#1e88e5",
        marginTop: 8,
    },
    hobbyInputContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    hobbyInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        fontSize: 14,
    },
    hobbyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 8,
    },
    hobbyText: {
        fontSize: 14,
        flex: 1,
    },
    hobbiesTable: {
        marginVertical: 5,
    },
    hobbyRow: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        backgroundColor: '#b5b5b5',
    },
    deleteButton: {
        padding: 5,
    },
    deleteButtonText: {
        fontSize: 24,
        color: '#ff3b30',
    },
    buttonSave: {
        backgroundColor: 'grey',
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        margin: 10,
    },
    buttonCancel: {
        backgroundColor: 'red',
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        margin: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    fieldGroup: {
        gap: 12,
    },
    pickerContainer: {
        marginTop: 8,
    },
    inlinePickerContainer: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    inlineActions: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
    },
})

export default globalStyles