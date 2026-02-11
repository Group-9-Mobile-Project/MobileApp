import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const globalStyles = StyleSheet.create({
    //AttendeeInfoModeal
    //ShowUserInfo
    //EventInfoScreen
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

    //CreateEvemtScreen
    //HomeScreen
    //ProfileScreen
    //UpdateEventScreen
    container: {
        flex: 1,
    },
    contentContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
    },

    //ExpandableListCard
    //EventFrom
    //AttendeeInfoModal
    //AllEventMapView
    //EventInfoScreen
    cardContainer: {
        alignContent: 'flex-start',
        marginBlockStart: 20,
        width: '100%',
        backgroundColor: Colors.light.background,
        marginBlockEnd: 10
    },

    //EventFrom
    cardContent: {
        gap: 12,
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: "top",
    },

    //EventFrom
    //EditUserInfo
    addButton: {
        backgroundColor: "green",
        alignItems: "center",
        padding: 12,
        borderRadius: 5,
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

    //EventFrom
    //RecentEventsList
    //ShowUsersEvents
    EventFormContainer: {
        padding: 16,
        gap: 16,
        width: "100%",
    },

    //ExpandableListCard
    //EventForm
    //AttendeeInfoModal
    //EditUserInfo
    //ShowUserInfo
    //EventInfoScreen
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    //ExpandableListCard
    //AllEventsMapView
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    //ExpandableListCard
    //AttendeeInfoModal
    //EventInfoScreen
    basicInfoView: {
        margin: 2,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
    },

    //AttendeeInfoModal
    //EventInfoScreen
    descriptionView: {
        width: "95%",
        margin: 8,
    },

    //SigleEventRow
    singleEventView: {
        marginTop: 8,
        width: '100%'
    },

    //SingleEventRow
    //AttendeeInfoRow
    //EditUserInfo
    subHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5
    },

    //JoinEventButton
    //EventFrom
    //AttendeeInfoModal
    //ShowUserInfo
    //EventInfoScreen
    buttonText: {
        fontWeight: "bold",
        alignItems: "center",
        padding: 12,
        marginVertical: 10,
        borderRadius: 10,
        fontSize: 16
    },

    //JoinEventButton
    //AttendeeInfoModal
    //ShowUserInfo
    //EventInfoScreen
    textPressed: {
        opacity: 0.6,
    },

    //SingleEventRow
    //AttendeeInfoModal
    //ShowUserInfo
    //EventInfoScreen
    infoText: {
        fontSize: 16,
        padding: 5,
    },

    //EventForm
    //EventInfoScreen
    //UpdateEventScreen
    helperText: {
        color: "#666",
        fontSize: 12,
    },

    //EventForm
    //AllEventsMapView
    //EditUserInfo
    label: {
        fontWeight: "600",
    },

    //EventInfoScreen
    organizerLink: {
        fontSize: 16,
        padding: 5,
        color: "#1e88e5"
    },
    pressableView: {
        flexDirection: "row",
        gap: 32,
    },

    //EventInfoScreen
    //UpdateEventScreen
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
    },

    //UpdateEventScreen
    linkText: {
        color: "#1e88e5",
        marginTop: 8,
    },

    //ExpandableListCard
    noEventsText: {
        fontSize: 16,
        fontStyle: 'italic'
    },

    //AllEventsMapView
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

    //MapAllEvents
    mapAllEvents: {
        width: '100%',
        height: '100%',
        margin: 8
    },

    //LocationFields
    fieldGroup: {
        gap: 12,
    },

    //EditUserInfo
    editUserContainer: {
        flex: 1,
        padding: 20,
        marginTop: 20,
        gap: 5,
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

    //EditUserInfo
    //ShowUserInfo
    hobbyText: {
        fontSize: 14,
        flex: 1,
    },

    //ShowUserInfo
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
    showUserContainer: {
        flex: 1,
        paddingVertical: 10,
        marginTop: 20,
        backgroundColor: 'lightgrey'
    },

    //LogOutButton
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
})

export default globalStyles