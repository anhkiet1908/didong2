import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// 🔥 IMPORT WEBVIEW
import { WebView } from 'react-native-webview';

import { CartItem, useCart } from "../../components/ui/CartContext";

// 🔥 LƯU Ý QUAN TRỌNG: Kiểm tra lại đường dẫn file này tùy vào cấu trúc thư mục của bạn
// Nếu file này nằm ở thư mục gốc (ngang hàng folder app), dùng ../..
import { createPaymentUrl } from "../vnpayHelper";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 1. DANH SÁCH PHƯƠNG THỨC THANH TOÁN
const PAYMENT_METHODS = [
    { id: 'cash', name: 'Tiền mặt', icon: 'cash', color: '#22c55e', description: 'Thanh toán khi nhận hàng' },
    { id: 'zalopay', name: 'ZaloPay', icon: 'qrcode-scan', color: '#0068ff', description: 'Quét mã QR ZaloPay' },
    { id: 'vnpay', name: 'VNPay', icon: 'credit-card-outline', color: '#E13636', description: 'Thẻ ATM / Mobile Banking' },
];

export default function CartScreen() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, addToCart, clearCart, selectedAddress } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [suggestedItems, setSuggestedItems] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

  const [addressDisplay, setAddressDisplay] = useState("123 Đường Tăng Nhơn Phú, TP.HCM"); 
  const [modalAddressVisible, setModalAddressVisible] = useState(false);
  const [tempAddress, setTempAddress] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedAddress) {
      setAddressDisplay(selectedAddress.detail);
    }
  }, [selectedAddress]);

  const [paymentMethod, setPaymentMethod] = useState('cash'); 
  const [modalPaymentVisible, setModalPaymentVisible] = useState(false);
  
  // --- STATE CHO ZALO PAY ---
  const [modalQRVisible, setModalQRVisible] = useState(false);
  const [qrValue, setQrValue] = useState(""); 
  
  // --- 🔥 STATE CHO VNPAY ---
  const [modalVnPayVisible, setModalVnPayVisible] = useState(false);
  const [vnpayUrl, setVnpayUrl] = useState("");

  const [currentOrderId, setCurrentOrderId] = useState(""); 

  const currentPayment = PAYMENT_METHODS.find(p => p.id === paymentMethod) || PAYMENT_METHODS[0];

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? (cart[0].deliveryFee || 15000) : 15000;
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

  const getUniqueId = (item: CartItem) => item.cartItemId || item.id;

  // FETCH MÓN GỢI Ý
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/product?pageSize=5");
        const data = await res.json();
        if (data.documents) {
          const products = data.documents.map((doc: any) => {
            const f = doc.fields;
            return {
              id: doc.name.split("/").pop(),
              name: f.name?.stringValue,
              price: f.price?.doubleValue ? parseFloat(f.price.doubleValue) : (parseInt(f.price?.integerValue) || 0),
              image: f.image?.stringValue,
            };
          });
          setSuggestedItems(products);
        }
      } catch (error) { console.log("Lỗi tải món gợi ý", error); }
    };
    fetchSuggested();
  }, []);

  const handleAddSuggestedItem = (item: any) => {
      const newItem: CartItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          toppings: [],
          note: "",
          cartItemId: `${item.id}-${Date.now()}`,
          deliveryFee: deliveryFee
      };
      addToCart(newItem);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Alert.alert("Thành công", `Đã thêm ${item.name} vào giỏ!`);
  };

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (newQuantity < 1) {
        Alert.alert("Xóa món", "Bạn muốn bỏ món này?", [
            { text: "Hủy", style: "cancel" },
            { text: "Xóa", style: "destructive", onPress: () => removeFromCart(getUniqueId(item)) },
        ]);
    } else {
        updateQuantity(getUniqueId(item), newQuantity);
    }
  };

  const renderRightActions = (item: CartItem) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          removeFromCart(getUniqueId(item));
      }}
    >
      <Ionicons name="trash-outline" size={24} color="white" />
      <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>Xóa</Text>
    </TouchableOpacity>
  );

  // --- XỬ LÝ ĐẶT HÀNG ---
  const handleCheckout = async () => {
      if(cart.length === 0) return;
      setIsSubmitting(true);

      try {
        const initialStatus = (paymentMethod === 'zalopay' || paymentMethod === 'vnpay') 
            ? 'pending_payment' 
            : 'kitchen';

        const orderPayload = {
            fields: {
                status: { stringValue: initialStatus },
                total: { doubleValue: total },
                deliveryFee: { doubleValue: deliveryFee },
                address: { stringValue: addressDisplay },
                date: { stringValue: new Date().toISOString() },
                restaurant: { stringValue: "App Order" },
                discount: { doubleValue: discount },
                paymentMethod: { stringValue: currentPayment.name }, 
                image: { stringValue: cart[0].image },
                items: {
                    arrayValue: {
                        values: cart.map(item => ({
                            mapValue: {
                                fields: {
                                    name: { stringValue: item.name },
                                    quantity: { integerValue: item.quantity.toString() },
                                    price: { doubleValue: item.price }
                                }
                            }
                        }))
                    }
                }
            }
        };

        const response = await fetch(
            "https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/orders?key=YOUR_API_KEY", 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            }
        );

        const result = await response.json();

        if (response.ok) {
            const orderId = result.name.split("/").pop();
            setCurrentOrderId(orderId);

            // 1. ZALO PAY
            if (paymentMethod === 'zalopay') {
                const fakeZaloPayUrl = `https://zalopay.vn/pay?order=${orderId}&amount=${total}`;
                setQrValue(fakeZaloPayUrl); 
                setModalQRVisible(true);    
            } 
            // 2. 🔥 VNPAY (Đã sửa lại logic cho đúng)
            else if (paymentMethod === 'vnpay') {
                const amountVND = Math.floor(total * 25000); // Quy đổi ra VND
                const url = createPaymentUrl(amountVND);
                
                console.log("LINK VNPAY: ", url); // Debug link
                setVnpayUrl(url);
                setModalVnPayVisible(true);
            }
            // 3. TIỀN MẶT
            else {
                Alert.alert("🎉 Đặt hàng thành công!", `Thanh toán bằng: ${currentPayment.name}`);
                clearCart();
                router.push("/(tabs)/orders");
            }
        } else {
            throw new Error("Lỗi kết nối server");
        }

      } catch (error) {
          Alert.alert("Lỗi", "Không thể đặt hàng. Vui lòng thử lại.");
          console.log(error);
      } finally {
          setIsSubmitting(false);
      }
  };

  // CẬP NHẬT TRẠNG THÁI ORDER THÀNH CÔNG
  const updateOrderStatusToKitchen = async () => {
    if (!currentOrderId) return;
    
    try {
        const updateUrl = `https://firestore.googleapis.com/v1/projects/anhkiet-61730/databases/(default)/documents/orders/${currentOrderId}?updateMask.fieldPaths=status&key=YOUR_API_KEY`;
        
        await fetch(updateUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: { status: { stringValue: 'kitchen' } } 
            })
        });

        clearCart();
        return true;
    } catch (e) {
        console.log("Lỗi update status", e);
        return false;
    }
  };

  // XỬ LÝ ZALOPAY
  const handleFinishZaloPayment = async () => {
      setIsSubmitting(true);
      await updateOrderStatusToKitchen();
      setModalQRVisible(false);
      Alert.alert("Thành công", "Đơn hàng đã được chuyển xuống bếp!");
      router.push("/(tabs)/orders");
      setIsSubmitting(false);
  };

  // 🔥 XỬ LÝ VNPAY (Khi WebView thay đổi URL)
  const handleVnpayStateChange = async (navState: any) => {
    const { url } = navState;

    if (url.includes("vnp_ResponseCode")) {
        const params = new URLSearchParams(url.split("?")[1]);
        const vnp_ResponseCode = params.get("vnp_ResponseCode");

        setModalVnPayVisible(false); // Đóng WebView

        if (vnp_ResponseCode === "00") {
            setIsSubmitting(true);
            await updateOrderStatusToKitchen(); 
            setIsSubmitting(false);
            
            Alert.alert("Thành công ✅", "Thanh toán VNPay hoàn tất!", [
                { text: "OK", onPress: () => router.push("/(tabs)/orders") }
            ]);
        } else {
            Alert.alert("Thất bại ❌", "Giao dịch bị hủy hoặc lỗi.");
        }
    }
  };

  const openAddressModal = () => {
      setTempAddress(addressDisplay); 
      setModalAddressVisible(true);
  };

  const saveAddress = () => {
      if (tempAddress.trim().length === 0) {
          Alert.alert("Lỗi", "Vui lòng nhập địa chỉ");
          return;
      }
      setAddressDisplay(tempAddress);
      setModalAddressVisible(false);
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/11329/11329060.png" }} style={styles.emptyImage} />
          <Text style={styles.emptyTitle}>Giỏ hàng trống!</Text>
          <Text style={styles.emptyDesc}>Hãy thêm vài món ngon nhé.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Giỏ hàng ({cart.length})</Text>
              <TouchableOpacity onPress={() => Alert.alert("Xóa tất cả", "Bạn chắc chắn muốn xóa?", [{text: "Hủy", style: "cancel"}, {text: "Xóa", style: "destructive", onPress: () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); clearCart(); }}])}>
                <Text style={styles.clearBtn}>Xóa tất cả</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 300 }} showsVerticalScrollIndicator={false}>
              <View style={styles.sectionContainer}>
                <View style={styles.addressCard}>
                  <View style={styles.iconCircle}><Ionicons name="location" size={20} color="#FF6B00" /></View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.label}>Giao đến</Text>
                    <Text style={styles.addressText} numberOfLines={2}>{addressDisplay}</Text>
                  </View>
                  <TouchableOpacity onPress={openAddressModal}><Text style={styles.editLink}>Sửa</Text></TouchableOpacity>
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Chi tiết đơn hàng</Text>
                {cart.map((item) => (
                  <View key={getUniqueId(item)} style={{marginBottom: 12}}>
                      <Swipeable renderRightActions={() => renderRightActions(item)}>
                          <View style={styles.cartItem}>
                              <Image source={{ uri: item.image }} style={styles.itemImage} />
                              <View style={styles.itemInfo}>
                                  <Text style={styles.itemTitle} numberOfLines={2}>{item.name}</Text>
                                  {item.toppings && item.toppings.length > 0 && <Text style={styles.itemToppings}>+ {item.toppings.join(", ")}</Text>}
                                  {item.note ? <View style={styles.noteDisplay}><Feather name="edit-3" size={10} color="#FF6B00" /><Text style={styles.noteText} numberOfLines={1}>{item.note}</Text></View> : null}
                                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                              </View>
                              <View style={styles.quantityControl}>
                                  <TouchableOpacity onPress={() => handleUpdateQuantity(item, item.quantity - 1)} style={styles.qBtn}><Feather name="minus" size={16} color="#333" /></TouchableOpacity>
                                  <Text style={styles.qText}>{item.quantity}</Text>
                                  <TouchableOpacity onPress={() => handleUpdateQuantity(item, item.quantity + 1)} style={styles.qBtn}><Feather name="plus" size={16} color="#333" /></TouchableOpacity>
                              </View>
                          </View>
                      </Swipeable>
                  </View>
                ))}
              </View>

              {suggestedItems.length > 0 && (
                  <View style={styles.sectionContainer}>
                  <Text style={styles.sectionHeader}>Mua kèm cho ngon miệng</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
                      {suggestedItems.map((item) => (
                      <TouchableOpacity key={item.id} style={styles.upsellCard} onPress={() => handleAddSuggestedItem(item)}>
                          <Image source={{ uri: item.image }} style={styles.upsellImage} />
                          <View style={{ padding: 8 }}>
                          <Text style={styles.upsellTitle} numberOfLines={1}>{item.name}</Text>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4}}>
                              <Text style={styles.upsellPrice}>${item.price.toFixed(2)}</Text>
                              <View style={styles.addBtnSmall}><Ionicons name="add" size={16} color="white" /></View>
                          </View>
                          </View>
                      </TouchableOpacity>
                      ))}
                  </ScrollView>
                  </View>
              )}

              <View style={styles.sectionContainer}>
                <View style={styles.billCard}>
                  <Text style={styles.sectionHeader}>Tổng cộng</Text>
                  <View style={styles.billRow}><Text style={styles.billLabel}>Tạm tính</Text><Text style={styles.billValue}>${subtotal.toFixed(2)}</Text></View>
                  <View style={styles.billRow}><Text style={styles.billLabel}>Phí giao hàng</Text><Text style={styles.billValue}>${deliveryFee.toFixed(2)}</Text></View>
                  {appliedPromo && <View style={styles.billRow}><Text style={[styles.billLabel, {color: 'green'}]}>Giảm giá</Text><Text style={[styles.billValue, {color: 'green'}]}>-${discount.toFixed(2)}</Text></View>}
                  <View style={styles.divider} />
                  <View style={styles.billRow}><Text style={styles.totalLabel}>Thành tiền</Text><Text style={styles.totalValue}>${total.toFixed(2)}</Text></View>
                </View>
              </View>

               <View style={{paddingHorizontal: 16}}>
                  <View style={styles.promoContainer}>
                    <MaterialCommunityIcons name="ticket-percent-outline" size={20} color="#FF6B00" />
                    <TextInput value={promoCode} onChangeText={setPromoCode} placeholder="Mã giảm giá (SAVE10)" style={styles.promoInput} />
                    <TouchableOpacity onPress={() => { if(promoCode === 'SAVE10') setAppliedPromo(true); else Alert.alert("Mã không đúng"); }}><Text style={styles.applyText}>Áp dụng</Text></TouchableOpacity>
                  </View>
               </View>
            </ScrollView>
          </View>

          <View style={[styles.checkoutContainer, { bottom: 100 }]}> 
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => setModalPaymentVisible(true)}>
                      <MaterialCommunityIcons name={currentPayment.icon as any} size={24} color={currentPayment.color} />
                      <View style={{marginLeft: 8}}><Text style={{fontSize: 14, fontWeight: 'bold', color: '#333'}}>{currentPayment.name}</Text></View>
                      <Ionicons name="chevron-forward" size={16} color="#999" style={{marginLeft: 4}} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalPaymentVisible(true)}><Text style={{color: '#FF6B00', fontWeight: 'bold', fontSize: 12}}>Thay đổi</Text></TouchableOpacity>
              </View>
              <TouchableOpacity style={[styles.checkoutBtn, isSubmitting && {backgroundColor: '#ccc'}]} onPress={handleCheckout} disabled={isSubmitting}>
                  {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkoutText}>Đặt hàng - {total.toFixed(2)}$</Text>}
              </TouchableOpacity>
          </View>

          {/* Modal Address */}
          <Modal animationType="slide" transparent={true} visible={modalAddressVisible} onRequestClose={() => setModalAddressVisible(false)}>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                      <View style={styles.modalOverlay}>
                          <View style={styles.modalContainer}>
                              <Text style={styles.modalTitle}>Địa chỉ giao hàng</Text>
                              <TextInput style={styles.addressInput} value={tempAddress} onChangeText={setTempAddress} placeholder="Nhập địa chỉ..." multiline autoFocus />
                              <View style={styles.modalButtons}>
                                  <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalAddressVisible(false)}><Text style={styles.cancelBtnText}>Hủy</Text></TouchableOpacity>
                                  <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={saveAddress}><Text style={styles.saveBtnText}>Lưu</Text></TouchableOpacity>
                              </View>
                          </View>
                      </View>
                  </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
          </Modal>

          {/* Modal Payment Select */}
          <Modal animationType="slide" transparent={true} visible={modalPaymentVisible} onRequestClose={() => setModalPaymentVisible(false)}>
              <TouchableWithoutFeedback onPress={() => setModalPaymentVisible(false)}>
                  <View style={styles.modalOverlay}>
                      <View style={[styles.modalContainer, {paddingBottom: 30}]}>
                          <Text style={styles.modalTitle}>Chọn cách thanh toán</Text>
                          {PAYMENT_METHODS.map((method) => (
                              <TouchableOpacity key={method.id} style={[styles.paymentMethodRow, paymentMethod === method.id && styles.paymentMethodSelected]} onPress={() => { setPaymentMethod(method.id); setModalPaymentVisible(false); }}>
                                  <View style={[styles.iconBox, {backgroundColor: method.color + '20'}]}><MaterialCommunityIcons name={method.icon as any} size={24} color={method.color} /></View>
                                  <View style={{flex: 1, marginLeft: 12}}><Text style={styles.paymentName}>{method.name}</Text><Text style={styles.paymentDesc}>{method.description}</Text></View>
                                  {paymentMethod === method.id && <Ionicons name="checkmark-circle" size={24} color="#FF6B00" />}
                              </TouchableOpacity>
                          ))}
                      </View>
                  </View>
              </TouchableWithoutFeedback>
          </Modal>

          {/* MODAL QR CODE (ZaloPay) */}
          <Modal animationType="fade" transparent={true} visible={modalQRVisible} onRequestClose={() => setModalQRVisible(false)}>
              <View style={styles.modalOverlay}>
                  <View style={[styles.modalContainer, { alignItems: 'center', paddingVertical: 40 }]}>
                      <Text style={styles.qrTitle}>Quét mã để thanh toán</Text>
                      <Text style={styles.qrDesc}>Sử dụng app ZaloPay hoặc Camera</Text>
                      <View style={styles.qrBox}>
                          {qrValue ? <QRCode value={qrValue} size={200} /> : <ActivityIndicator />}
                      </View>
                      <Text style={styles.qrAmount}>Số tiền: ${total.toFixed(2)}</Text>
                      <TouchableOpacity style={styles.finishBtn} onPress={handleFinishZaloPayment} disabled={isSubmitting}>
                          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.finishText}>Đã thanh toán xong</Text>}
                      </TouchableOpacity>
                  </View>
              </View>
          </Modal>

          {/* 🔥🔥 MODAL WEBVIEW VNPAY (ĐÃ SỬA VÀ CHECK KỸ) 🔥🔥 */}
          <Modal animationType="slide" visible={modalVnPayVisible} onRequestClose={() => setModalVnPayVisible(false)}>
              <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                  <View style={styles.header}>
                      <TouchableOpacity onPress={() => setModalVnPayVisible(false)} style={{padding: 5}}>
                          <Ionicons name="close" size={30} color="#333" />
                      </TouchableOpacity>
                      <Text style={[styles.headerTitle, {flex: 1, textAlign: 'center'}]}>Thanh toán VNPay</Text>
                      <View style={{width: 30}} />
                  </View>

                  {vnpayUrl ? (
                      <WebView
                          source={{ uri: vnpayUrl }}
                          style={{ flex: 1 }}
                          onNavigationStateChange={handleVnpayStateChange}
                          startInLoadingState={true}
                          renderLoading={() => <ActivityIndicator size="large" color="#FF6B00" style={{marginTop: 50}} />}
                      />
                  ) : (
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                          <ActivityIndicator size="large" color="#FF6B00" />
                          <Text>Đang tạo đơn hàng...</Text>
                      </View>
                  )}
              </SafeAreaView>
          </Modal>

        </SafeAreaView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F5F8" },
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "white", elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  clearBtn: { color: "#FF3B30", fontWeight: "bold" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'white' },
  emptyImage: { width: 120, height: 120, marginBottom: 20, opacity: 0.8 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  emptyDesc: { color: "#888" },
  sectionContainer: { marginTop: 16, paddingHorizontal: 16 },
  sectionHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 12, color: "#333" },
  addressCard: { flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 12, borderRadius: 12 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFF0E0", alignItems: "center", justifyContent: "center" },
  label: { fontSize: 12, color: "#888" },
  addressText: { fontSize: 14, fontWeight: "600", color: "#333" },
  editLink: { color: "#FF6B00", fontWeight: "bold", marginLeft: 'auto', padding: 8 }, 
  cartItem: { flexDirection: "row", backgroundColor: "white", borderRadius: 12, padding: 12 },
  deleteButton: { backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center', width: 70, height: '100%', borderRadius: 12, marginLeft: 8 },
  itemImage: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  itemInfo: { flex: 1, justifyContent: "center" },
  itemTitle: { fontSize: 15, fontWeight: "600" },
  itemToppings: { fontSize: 11, color: "#666", fontStyle: 'italic' },
  noteDisplay: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5E6', padding: 4, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
  noteText: { fontSize: 11, color: "#FF6B00", marginLeft: 4, fontStyle: 'italic' },
  itemPrice: { fontSize: 15, fontWeight: "bold", color: "#FF6B00", marginTop: 4 },
  quantityControl: { alignItems: "center", justifyContent: 'space-between', backgroundColor: '#f9f9f9', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 6 },
  qBtn: { padding: 4 },
  qText: { fontWeight: "bold", marginVertical: 4 },
  upsellCard: { width: 140, backgroundColor: "white", borderRadius: 12, marginRight: 12, padding: 8, elevation: 1 },
  upsellImage: { width: "100%", height: 90, borderRadius: 8 },
  upsellTitle: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  upsellPrice: { fontSize: 13, fontWeight: "bold", color: "#FF6B00" },
  addBtnSmall: { backgroundColor: '#FF6B00', borderRadius: 8, padding: 2 },
  billCard: { backgroundColor: "white", borderRadius: 16, padding: 16 },
  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  billLabel: { color: "#666" },
  billValue: { fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 12, borderStyle: 'dashed', borderWidth: 1 },
  totalLabel: { fontSize: 16, fontWeight: "bold" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#FF6B00" },
  promoContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 10, padding: 12, marginTop: 16 },
  promoInput: { flex: 1, marginLeft: 8 },
  applyText: { color: "#FF6B00", fontWeight: "bold" },
  checkoutContainer: { position: 'absolute', left: 0, right: 0, backgroundColor: "white", padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  checkoutBtn: { backgroundColor: "#FF6B00", borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "center", alignItems: "center" },
  checkoutText: { color: "white", fontSize: 18, fontWeight: "bold", marginRight: 8 },
  checkoutTotal: { color: "white", fontWeight: "bold", fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { backgroundColor: 'white', width: '100%', borderRadius: 20, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  modalSubTitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  addressInput: { backgroundColor: '#F5F5F8', borderRadius: 12, padding: 15, fontSize: 16, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#eee' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: '#f0f0f0', marginRight: 10 },
  saveBtn: { backgroundColor: '#FF6B00', marginLeft: 10 },
  cancelBtnText: { color: '#333', fontWeight: 'bold' },
  saveBtnText: { color: 'white', fontWeight: 'bold' },
  paymentMethodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  paymentMethodSelected: { backgroundColor: '#FFF5E6', borderRadius: 10, paddingHorizontal: 10, borderBottomWidth: 0 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  paymentName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  paymentDesc: { fontSize: 12, color: '#888' },
  qrTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  qrDesc: { color: '#666', marginBottom: 24 },
  qrBox: { padding: 16, backgroundColor: 'white', borderRadius: 16, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 24 },
  qrAmount: { fontSize: 20, fontWeight: 'bold', color: '#FF6B00', marginBottom: 30 },
  finishBtn: { backgroundColor: '#22c55e', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 30 },
  finishText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});