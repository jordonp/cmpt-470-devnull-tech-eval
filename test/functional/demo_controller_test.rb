require 'test_helper'

class DemoControllerTest < ActionController::TestCase
  test "should get demo_1" do
    get :demo_1
    assert_response :success
  end

  test "should get demo_2" do
    get :demo_2
    assert_response :success
  end

  test "should get demo_3" do
    get :demo_3
    assert_response :success
  end

end
